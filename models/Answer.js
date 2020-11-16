const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const AnswerSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  thread: {
    type: ObjectId,
    ref: 'Thread',
    required: true
  },
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = model('Answer', AnswerSchema);
