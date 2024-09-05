const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  tries: {
    type: Number,
    default: 0
  },    // Field to count failed login attempts
  isLocked: {
    type: Boolean,
    default: false
  }, // Field to lock account after 5 failed attempts
  createdAt: {
    type: Date,
    default: new Date()
  },// Field to record the creation time
  lockTime: {
    type: Date
  } // Field to record the time when the account becomes locked
});


const LoginUser = mongoose.model('LoginUser', loginSchema);
module.exports = LoginUser;
