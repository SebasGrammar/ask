const express = require('express');
const ErrorResponse = require('../utils/errorResponse');

function errorHandler(err, req, res, next) {
  // log to console for the developer
  let error = { ...err };

  error.message = err.message;

  // Mongoose bad ObjectId

  if (err.name === 'CastError') {
    const message = `Resource with id of ${err.value} not found.`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key

  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(({ message }, index) => {
      return index === 0
        ? message.replace(/(?<! \.\.)\.$/, '')
        : ` ${message.replace(/(?<! \.\.)\.$/, '')}`; // regex for matching dot at the end of sentence
    }); // it's the same as (value => value.message)

    error = new ErrorResponse(message, 400); // now... why is this necessary? the outer error variable, I mean.
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server error'
  });
}

module.exports = errorHandler;
