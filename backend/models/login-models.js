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
    default: Date.now,
    expires: '5min'  // Automatically remove the document after 24 hours
  },
  lockTime: {
    type: Date,
  } // Field to record the time when the account becomes locked
});

// Create the TTL index on the 'createdAt' field to delete the document after 24 hours
loginSchema.index({ createdAt: 1 }, { expireAfterSeconds:  2 * 60 });

const LoginUser = mongoose.model('LoginUser', loginSchema);

module.exports = LoginUser;
