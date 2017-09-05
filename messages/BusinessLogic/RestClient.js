'use strict';

const httpService = require('./httpService');
const Utils = require('./Utils');

module.exports = {

    compareUtil(valueToCompare, session, funs, url2) {
        httpService.get(url2)
            .then(function gotData(data) {
                const jsonData = JSON.parse(data);
                const valueNow = jsonData.serie.length != 0 ? jsonData.serie[0].valor : undefined;

                if (valueToCompare === undefined && valueNow !== undefined) {
                    session.send(`Solo existe el valor actual **${valueNow}**, el valor a comparar no está definido`);
                } else if (valueToCompare !== undefined && valueNow === undefined) {
                    session.send(`Solo existe el valor a comparar **${valueToCompare}**, el valor actual no está definido`);
                } else if (valueToCompare === undefined && valueNow === undefined) {
                    session.send('Ninguno de los valores está definido');
                } else if (valueToCompare > valueNow) {
                    session.send(`El valor a comparar **${valueToCompare}** es mayor al actual **${valueNow}**`);
                } else if (valueToCompare < valueNow) {
                    session.send(`El valor actual **${valueNow}** es mayor que el valor a comparar **${valueToCompare}**`);
                } else {
                    session.send(`Los valores son iguales: **${valueNow}**`);
                }

                funs.forEach(f => f());
            })
            .catch(function (error) {
                session.send(`Lo sentimos, ha ocurrido el sgte error **${error}**`);
            });
    },

    toCompareValue(session, funs) {
        const indicator = this._Indicators[session.dialogData.indicator];
        const dateToCompare = this._formatDate(session.dialogData.date);
        const today = this._formatDate(Utils.getDateWithoutTime(new Date()));
        const url1 = `http://mindicador.cl/api/${indicator}/${dateToCompare}`;
        const url2 = `http://mindicador.cl/api/${indicator}/${today}`;

        if (dateToCompare === today) {
            session.send('La fecha a comprar es igual al presente día.');
            module.exports.toKnowValue(session, funs);
            return;
        }

        httpService
            .get(url1)
            .then((data) => {
                const jsonData = JSON.parse(data);
                return jsonData.serie.length != 0 ? jsonData.serie[0].valor : undefined;
            })
            .then((valueToCompare) => module.exports.compareUtil(valueToCompare, session, funs, url2))
            .catch((error) => session.send(`Lo sentimos, ha ocurrido el sgte error **${error}**`));
    },

    toKnowValue(session, funs) {
        const indicator = this._Indicators[session.dialogData.indicator];
        const date = this._formatDate(session.dialogData.date);
        const url = `http://mindicador.cl/api/${indicator}/${date}`;

        httpService.get(url)
            .then(function gotData(data) {
                const result = JSON.parse(data);
                session.send(`El indicador **${session.dialogData.indicator}** para la fecha **${date}** es **${result.serie.length != 0 ? result.serie[0].valor : "No existe valor en la fecha indicada"}**`);
                funs.forEach(f => f());
            })
            .catch(function (error) {
                session.send(`Lo sentimos, ha ocurrido el sgte error **${error}**`);
            });
    },

    _formatDate: (d) => `${d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`}` +
        `-${d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`}` +
        `-${d.getFullYear()}`,

    _Indicators: {
        'Unidad de fomento': 'uf',
        'Índice de valor promedio': 'ivp',
        'Dólar observado': 'dolar',
        'Dólar acuerdo': 'dolar_intercambio',
        'Euro': 'euro',
        'Índice de Precios al Consumidor': 'ipc',
        'Unidad Tributaria Mensual': 'utm',
        'Imacec': 'imacec',
        'Tasa Política Monetaria': 'tpm',
        'Libra de Cobre': 'libra_cobre',
        'Tasa de desempleo': 'tasa_desempleo',
        'uf': 'uf',
        'ivp': 'ivp',
        'dólar': 'dolar',
        'dólar acuerdo': 'dolar_intercambio',
        'euro': 'euro',
        'ipc': 'ipc',
        'utm': 'utm',
        'imacec': 'imacec',
        'tpm': 'tpm',
        'cobre': 'libra_cobre',
        'desempleo': 'tasa_desempleo'
    },
};

// var Indicators = {
//     uf: { name: "uf", startyear: 1977 }                   //Unidad de fomento.
//     , ivp: { name: "ivp", startyear: 1990 }                 //Indice de valor promedio.
//     , dolar: { name: "dolar", startyear: 1984 }               //Dólar observado.
//     , dolar_intercambio: { name: "dolar_intercambio", startyear: 1988 }   //Dólar acuerdo.
//     , euro: { name: "euro", startyear: 1999 }                //euro.
//     , ipc: { name: "ipc", startyear: 1928 }                 //Índice de Precios al Consumidor
//     , utm: { name: "utm", startyear: 1990 }                 //Unidad Tributaria Mensual.
//     , imacec: { name: "imacec", startyear: 2004 }              //Imacec.
//     , tpm: { name: "tpm", startyear: 2001 }                 //Tasa Política Monetaria.
//     , libra_cobre: { name: "libra_cobre", startyear: 2012 }        //Libra de Cobre.
//     , tasa_desempleo: { name: "tasa_desempleo", startyear: 2009 }    //Tasa de desempleo.
// }

