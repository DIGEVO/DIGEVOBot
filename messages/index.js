'use strict';

const botbuilder_azure = require('botbuilder-azure');
var builder = require('botbuilder');
var path = require('path');

require('dotenv').config();

const Utils = require('./BusinessLogic/Utils');
const Logic = require('./BusinessLogic/Logic');

const connector = Utils.getConnector(builder);

var bot = new builder.UniversalBot(connector, {
    localizerSettings: {
        defaultLocale: process.env.DEFAULT_LOCALE
    }
});

bot.localePath(path.join(__dirname, './locale'));

let luisApp = process.env.LUIS_APP;
let luisKey = process.env.LUIS_KEY;
var model = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/${luisApp}?subscription-key=${luisKey}&timezoneOffset=0&verbose=true`;

var recognizer = new builder.LuisRecognizer(model);
//todo esto me dice que puedo usar varias reconocerdores a la vez ;-).
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });

bot.dialog('/', dialog);

function findAllEntities(entities, pattern) {
    const result = entities.find(e => e.type.includes(pattern));
    return result == undefined ? [] : result;
}

function checkIndicator(){

}

dialog.matches('ConocerIndicador', [
    function (session, args, next) {
      //  console.log('working! 1');
        //var dates = builder.EntityRecognizer.findAllEntities(args.entities, '*datetime*');
        const dates = findAllEntities(args.entities, 'datetime');
        const indicators = findAllEntities(args.entities, 'indicator');

        console.log(dates.resolution!= undefined? dates.resolution.values.map(v => v.value):[]);

        console.log(indicators.resolution!= undefined? indicators.resolution.values:[]);

        //todo luego de recoger las salidas de luis,
        //guardar tanto indicadores como tiempos en el bag del dialog
        //crear una funciona para cada entidad, 
        //si hay más de una entidad preguntar cual usa
        //si solo hay una next
        //por ultimo llamar a la logica para q me devuelva los valores segun consulta.
         // console.log(dates);
        // console.log(args);
    }
]);

dialog.matches('CompararIndicador', [
    function (session, args, next) {
        console.log('working! 2');
    }
]);

dialog.onDefault(builder.DialogAction.send('Disculpa, ' +
    '¿puede volver a comentarme que deseas hacer?,' +
    ' por favor, prueba decirlo de otra forma.'));

// //TODO hacerlo proactivo, en cuanto se conecte q me salude y pregunte.
// bot.dialog('/', [
//     Logic.chooseAction,
//     Logic.chooseIndicator,
//     Logic.provideDate,
//     Logic.realizeIntention,
//     (session, results) => {
//         if (!results.response) {
//             session.endConversation(`Hasta la próxima ${session.message.user.name.split(" ", 1)[0]}`);
//         } else {
//             session.replaceDialog('/', { reprompt: true });
//         }
//     }
// ]);

bot.dialog('/Cancelar', [
    function (session) {
        session.endDialog(`No hay problemas ${session.message.user.name.split(" ", 1)[0]}, hasta la próxima.`)
    }
]).triggerAction({ matches: /^cancelar$|^salir$|^terminar$|^exit$|^quit$/i });

module.exports = Utils.startServer(connector);
