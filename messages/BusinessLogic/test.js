// 'use strict';

// const httpService = require('./httpService'); // the above wrapper

// // get one URL
// // httpService.get('http://mindicador.cl/api/dolar/2017').then(function gotData(data) {
// //     console.log(data);
// // });

// // 
// // // get multiple URLs
// const urls = [
//     'http://mindicador.cl/api/dolar/2017'
// ];

// /* map the URLs to Promises. This will actually start the
//  * requests, but Promise.prototype.then is always called,
//  * even if the operation has resolved */
// const promises = urls.map(url => httpService.get(url));

// // Promise.all(promises).then(function gotData(responses) {
// //     /* responses is an array containing the result of each
// //      * Promise. This is ordered by the order of the URLs in the
// //      * urls array */

// //     const swansonQuote = responses[0];
// //    // const chuckNorrisQuote = responses[1];

// //     console.log(swansonQuote);
// //   //  console.log(chuckNorrisQuote);
// // });

// let formatDate = (d) => `${d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`}` +
//     `-${d.getMonth() + 1 > 9 ? d.getMonth() + 1 : `0${d.getMonth() + 1}`}` +
//     `-${d.getFullYear()}`;

// let f = new Date();
// console.log(formatDate(f));

// console.log(new Date());


// function formatDate1(date) {
//     var monthNames = [
//         "January", "February", "March",
//         "April", "May", "June", "July",
//         "August", "September", "October",
//         "November", "December"
//     ];

//     var day = date.getDate();
//     var monthIndex = date.getMonth();
//     var year = date.getFullYear();

//     return day + ' ' + monthNames[monthIndex] + ' ' + year;
// }

// console.log(formatDate1(new Date()));  // show current date-time in console
// // var fecha = new Date();
// // var options = { year: 'numeric', month: 'long', day: 'numeric' };

// // console.log(
// //   fecha.toLocaleDateString("es-ES", options)
// // );

// let f1 = new Date();
// f1.setHours(0);
// f1.setMinutes(0);
// f1.setSeconds(0);
// f1.setMilliseconds(0);
// console.log(f1);

let tmp = {
    0 : 'a',
    1 : 'b',
    2 : 'c'
}

console.log(Object.values(tmp));

















