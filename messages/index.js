'use strict';

const botbuilder_azure = require('botbuilder-azure');
var builder = require('botbuilder');
var path = require('path');

require('dotenv').config();

const Utils = require('./BusinessLogic/Utils');
const Logic = require('./BusinessLogic/Logic');

//var connector = Utils.getConnector(builder);
const connector = process.env.NODE_ENV == 'development' ?
    new builder.ChatConnector() :
    new botbuilder_azure.BotServiceConnector({
        appId: process.env['MicrosoftAppId'],
        appPassword: process.env['MicrosoftAppPassword'],
        stateEndpoint: process.env['BotStateEndpoint'],
        openIdMetadata: process.env['BotOpenIdMetadata']
    });

var bot = new builder.UniversalBot(connector, {
    localizerSettings: {
        defaultLocale: process.env.DEFAULT_LOCALE
    }
});

bot.localePath(path.join(__dirname, './locale'));

//TODO hacerlo proactivo, en cuanto se conecte q me salude y pregunte.
bot.dialog('/', [
    Logic.chooseAction,
    Logic.chooseIndicator,
    Logic.provideDate,
    Logic.realizeIntention,
    (session, results) => {
        if (!results.response) {
            session.endConversation(`Hasta la próxima ${session.message.user.name.split(" ", 1)[0]}`);
        } else {
            session.replaceDialog('/', { reprompt: true });
        }
    }
]);

//Utils.startServer(connector);
if (process.env.NODE_ENV == 'development') {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(process.env.PORT, function () {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}
