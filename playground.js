const geocoder = require('./utils/geocoder');
// const dotenv = require('dotenv');

// dotenv.config({
//   path: './config/config.env'
// });

// geocoder.geocode('Medellín, Colombia', function (error, data) {
//   console.log(data);
// });

console.log(geocoder.geocode('Medellín, Colombia')); // Ok, this is the promise.
geocoder.geocode('Medellín, Colombia').then((data) => {
  console.log(data);
});

// console.log(
//   geocoder.geocode('Medellín, Colombia', function (error, data) {
//     console.log(data);
//   })
// );

// async function log() {
//   const data = await geocoder.geocode('Medellín, Colombia');
//   console.log(data);
// }

// log();

// console.log(process.env.GEOCODER_API_KEY);
