'use strict';

const builder = require('botbuilder');

const Utils = require('./Utils');
const RestClient = require('./RestClient');

module.exports = {
    /**
     * 
     */
    begingTheFeed(session, args, next) {
        session.dialogData.entities = args.entities;
        session.dialogData.intent = args.intent;
        next();
    },
    /**
     * 
     */
    checkIndicator(session, args, next) {
        module.exports.checkEntity(
            session,
            next,
            Utils.findAllEntities(session.dialogData.entities, 'indicator'),
            'Por favor, seleccione el indicador correcto',
            'indicator',
            () => module.exports.askIndicator(session)
        );
    },
    /**
     * 
     */
    saveIndicator(session, args, next) {
        session.dialogData.indicator =
            session.dialogData.indicator ||
            args.response.entity;

        next();
    },
    /**
     * 
     */
    checkDate(session, args, next) {
        module.exports.checkEntity(
            session,
            next,
            Utils.findAllEntities(session.dialogData.entities, 'datetime').map(v => v.value),
            'Por favor, seleccione la fecha correcta',
            'date',
            () => module.exports.askDate(session)
        );
    },
    /**
     * 
     */
    saveDate(session, args, next) {
        const date =
            session.dialogData.date ||
                (!args.response.hasOwnProperty('type') && args.response.entity) ?
                new Date(session.dialogData.date || args.response.entity) :
                builder.EntityRecognizer.resolveTime([args.response]);

        session.dialogData.date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

        next();
    },
    /**
     * 
     */
    checkEntity(session, next, entities, question, key, askEntity) {
        if (entities && entities.length == 1) {
            session.dialogData[key] = entities[0];
            next();
        } else {
            if (!entities || entities.length == 0) {
                askEntity();
            } else {
                builder.Prompts.choice(
                    session,
                    question,
                    entities.join('|'),
                    { listStyle: builder.ListStyle.list });
            }
        }
    },
    /**
     * 
     */
    askIndicator(session) {
        let question;
        let indicators;
        let style;
        if (session.message.user.id == 'TwitterChannel') {
            question = 'Selecione indicador';
            indicators = Utils.Indicators_Twttr;
            style = builder.ListStyle.inline;
        } else {
            question = '¿Cuál de los siguientes indicadores deseas conocer?';
            indicators = Utils.Indicators;
            style = builder.ListStyle.list;
        }

        builder.Prompts.choice(session, question,
            Object.keys(indicators).map(k => indicators[k]), { listStyle: style });
    },
    /**
     * 
     */
    askDate(session) {
        //TODO puede reconocer varios valores...temporalmente reconoce solo uno.
        builder.Prompts.time(session, '¿De cuál fecha desea el indicador?');
    },
    /**
     * 
     */
    realizeIntention(session, args, next) {
        if (Utils.getDateWithoutTime(session.dialogData.date).getTime() >
            Utils.getDateWithoutTime(new Date()).getTime()) {
            //session.send(`Uff! desea predecir y ${session.dialogData.opcion.toLowerCase()} **${session.dialogData.indicador}**, de la fecha **${session.dialogData.fecha.toDateString()}**`);
            session.send('Estamos trabajando en la predicción.');
        } else {
           // session.privateConversationData.continue = true;
            if (session.dialogData.intent == 'ConocerIndicador') {
                //session.send(`obtener el valor de ${session.dialogData.indicator} del día ${session.dialogData.date}`);
                RestClient.toKnowValue(session,[]);
                    //[() => builder.Prompts.confirm(session, '¿Desea continuar?', { listStyle: builder.ListStyle.button })]);
            } else {
              //  session.send(`Comparar el valor de ${session.dialogData.indicator} del día ${session.dialogData.date} con el valor de hoy`);
                 RestClient.toCompareValue(session,[]);
               //     [() => builder.Prompts.confirm(session, '¿Desea continuar?', { listStyle: builder.ListStyle.button })]);
            }
        }
    }
};