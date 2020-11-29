const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const AnswerSchema = new Schema({
  title: String, // Perhaps this is not necessary at all!
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
    type: String,
    ref: 'User',
    required: true
  },
  likes: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ]
});

module.exports = model('Answer', AnswerSchema);
