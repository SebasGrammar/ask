const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const ThreadSchema = new Schema({
  title: {
    type: String,
    required: [true, 'You must add a title to your thread.']
  },
  author: {
    type: ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = model('Thread', ThreadSchema);
