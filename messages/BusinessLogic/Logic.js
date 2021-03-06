'use strict';

const builder = require('botbuilder');

const Utils = require('./Utils');
const RestClient = require('./RestClient');

module.exports = {
    //TODO verificar el 1er contacto, ver q sea cordial, de lo contrario lanzar frase..., etc.
    /*
    */
    chooseAction(session, results, next) {
        const firstName = session.message.user.name.split(" ", 1)[0];
        const greetings = Utils.greetting(session);
        const introduceBot = session.privateConversationData.continue ?
            '¿Cuál acción desea realizar?' :
            `Hola ${firstName}, ${greetings}, ¿cuál acción desea realizar?`;

        builder.Prompts.choice(session, introduceBot,
            'Comparar valor de indicador|Conocer valor de indicador',
            { listStyle: builder.ListStyle.button });
    },
    /*
    */
    chooseIndicator(session, results) {
        session.dialogData.opcion = results.response.entity;
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
    /*
    */
    provideDate(session, results) {
        session.dialogData.indicador = results.response.entity;
        builder.Prompts.time(session,
            `¿De cuál fecha desea ${session.dialogData.opcion.toLowerCase()}?`);
    },
    /*
    */
    realizeIntention(session, results) {
        session.dialogData.fecha = builder.EntityRecognizer.resolveTime([results.response]);

        if (Utils.getDateWithoutTime(session.dialogData.fecha) > new Date().getTime()) {
            session.send(`Uff! desea predecir y ${session.dialogData.opcion.toLowerCase()} **${session.dialogData.indicador}**, de la fecha **${session.dialogData.fecha.toDateString()}**`);
        } else {
            session.privateConversationData.continue = true;
            if (session.dialogData.opcion == 'Conocer valor de indicador') {
                RestClient.toKnowValue(session,
                    [() => builder.Prompts.confirm(session, '¿Desea continuar?', { listStyle: builder.ListStyle.button })]);
            } else {
                RestClient.toCompareValue(session,
                    [() => builder.Prompts.confirm(session, '¿Desea continuar?', { listStyle: builder.ListStyle.button })]);
            }
        }
    }
};