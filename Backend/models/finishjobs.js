const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  name: { type: String, required: true },
  tests: [
    {
      testId: { type: String, required: true },
      testResult: { type: String, enum: ['Pass', 'Fail'], required: true },
      reason: { type: String, default: null }
    }
  ]
});

module.exports = mongoose.model('finishJob', JobSchema);
