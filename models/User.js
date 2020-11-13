const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const geocoder = require('../utils/geocoder');

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "We'd like to know what your first name is."]
  },
  lastName: {
    type: String,
    required: [true, "We'd like to know what your last name is."]
  },
  email: {
    type: String,
    required: [true, 'Please add an email.'],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email.'
    ]
  },
  password: {
    type: String,
    minlength: 6,
    default: '123456',
    select: false
  },
  //   location: {},
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  avatar: {
    type: String,
    default: 'no-avatar.jpg'
  },

  address: {
    type: String,
    required: [true, 'Please add an address.']
  },
  //   location: {
  //     // GeoJSON Point
  //     type: {
  //       type: String,
  //       enum: ['Point'],
  //       required: false // these were true by default! set them back to true when done testing
  //     },
  //     coordinates: {
  //       type: [Number],
  //       required: false, // these were true by default! set them back to true when done testing
  //       index: '2dsphere'
  //     },
  //     formattedAddress: String,
  //     street: String,
  //     city: String,
  //     state: String,
  //     country: String,
  //     zipcode: String
  //   },

  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
      required: false // these were true by default! set them back to true when done testing
    },
    coordinates: {
      type: [Number],
      required: false, // these were true by default! set them back to true when done testing
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  askedQuestions: {
    // Would it be convenient to put this in the database? I don't think so... maybe I can use virtuals here?
  },
  answeredQuestions: {},
  savedQuestions: {}
});

// Okay... I already know why the code below is not working as expected. As you can see,
// the call of the next function is outside the then block. As a result, it's running
// before the promise has resolved! so, in a nutshell, the code inside the then block
// is not doing anything at all!

// UserSchema.pre('save', function (next) {
//   console.log(this);

//   geocoder.geocode(this.address).then((data) => {
//     const [location] = data; // this is the same as data[0]
//     console.log(location);
//     console.log(this);
//     this.location = {
//       type: 'Point',
//       coordinates: [location.longitude, location.latitude],
//       formattedAddress: location.formattedAddress,
//       street: location.streetName,
//       city: location.city,
//       state: location.stateCode,
//       country: location.countryCode,
//       zipcode: location.zipcode
//     };
//   });
//   this.location = 'Lsda';
//   this.avatar = 'PAto';
//   next();
// });

UserSchema.pre('save', function (next) {
  geocoder
    .geocode(`${this.city}, ${this.country} - ${this.address}`)
    .then((data) => {
      console.log(`${this.city}, ${this.country} - ${this.address}`);
      const [location] = data; // this is the same as data[0]
      this.location = {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        formattedAddress: location.formattedAddress,
        street: location.streetName,
        city: location.city,
        state: location.stateCode,
        country: location.countryCode,
        zipcode: location.zipcode
      };

      this.address = undefined;

      next();
    });
});

module.exports = model('User', UserSchema);
