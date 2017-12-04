'use strict';

const botbuilder_azure = require('botbuilder-azure');
const builder = require('botbuilder');
const path = require('path');

require('dotenv').config();

const Utils = require('./BusinessLogic/Utils');
const Logic = require('./BusinessLogic/Logic');
const LUISLogic = require('./BusinessLogic/LUISLogic');

const connector = Utils.getConnector(builder);

const bot = new builder.UniversalBot(connector, {
    localizerSettings: {
        defaultLocale: process.env.DEFAULT_LOCALE
    }
});

bot.localePath(path.join(__dirname, './locale'));

const recognizer = new builder.LuisRecognizer(Utils.getLUISModel());
const dialog = new builder.IntentDialog({ recognizers: [recognizer] });

//TODO ver la forma de cambiar el mensaje antes de q entre al dialogo(middleware).
bot.dialog('/', dialog);

const waterfall = [
    LUISLogic.begingTheFeed,
    LUISLogic.checkIndicator,
    LUISLogic.saveIndicator,
    LUISLogic.checkDate,
    LUISLogic.saveDate,
    LUISLogic.realizeIntention
];

dialog.matches('ConocerIndicador', waterfall);

dialog.matches('CompararIndicador', waterfall);

dialog.onDefault(builder.DialogAction.send('Disculpa, ' +
    '¿puede volver a comentarme que deseas hacer?,' +
    ' por favor, prueba decirlo de otra forma.'));

bot.dialog('/Cancelar', [
    (session) =>
        session.endDialog(`No hay problemas ${session.message.user.name.split(" ", 1)[0]}, hasta la próxima.`)
]).triggerAction({ matches: /^cancelar$|^salir$|^terminar$|^exit$|^quit$/i });

module.exports = Utils.startServer(connector);
