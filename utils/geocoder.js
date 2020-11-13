const NodeGeocoder = require('node-geocoder');
const dotenv = require('dotenv');

dotenv.config({
  // This is temporal. I was getting an error that said the requests status was REQUEST_DENIED
  // and that's because the environment variables were not being set. Since I'm not using routes yet, I have to
  // import dotenv here to be able to set the variables.
  path: './config/config.env'
});

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
