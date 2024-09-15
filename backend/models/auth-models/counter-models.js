const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id:
   { 
    type: String,
    equired: true
   },
  sequence_value:
   { 
    type: Number,
    default: 0 
   },
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
