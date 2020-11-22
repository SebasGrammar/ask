const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema;
const geocoder = require('../utils/geocoder');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "We'd like to know what your first name is."]
  },
  lastName: {
    type: String,
    required: [true, "We'd like to know what your last name is."]
  },
  username: {
    type: String,
    required: [true, 'Please enter a username.'],
    unique: true
  },
  slug: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
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
    select: false,
    required: [true, 'Please enter a password.']
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
  country: {
    type: String,
    require: [true, 'What country do you live in?']
  },
  city: {
    type: String,
    require: [true, 'What city do you live in?']
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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },

  askedQuestions: [
    {
      // Would it be convenient to put this in the database? I don't think so... maybe I can use virtuals here?}
      type: ObjectId,
      ref: 'Thread'
    }
  ],
  answeredQuestions: [
    {
      type: ObjectId,
      ref: 'Thread'
    }
  ],
  savedQuestions: [
    {
      type: ObjectId,
      ref: 'Thread'
    }
  ]
});

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
      this.country = undefined;
      this.city = undefined; // I should refactor this... find a way to prevent repeating so much code.

      next();
    });
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
  console.log('THIS SHIT IS RUNNING SO WATCH OUT');
  // OHH.. so, for this middleware to run, this has to actually be a SAVE request.
  // so if the request is, say, findByIdAndUpdate, this won't run!!
  if (!this.isModified('password')) {
    // If the password hasn't changed, just move on (next()).
    // When you create a new user, the password field will change and the code below will run.
    // Same thing when you change your password!

    // Now, here's something I just learnt! I had the password field set to 123456 by default,
    // and when I ran the seeder, this middleware didn't run... so it seems this method won't be
    // executed if a value has been set by default. Perhaps default runs before everything else?
    next();
  }

  // This down here will only run if the password field has changed!
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate and hash password token
// This one is called on the instances of User, not on the model itself.
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set resetPasswordExpire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = model('User', UserSchema);
