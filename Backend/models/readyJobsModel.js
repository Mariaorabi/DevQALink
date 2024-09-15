// server/models/readyJobModel.js
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-sequence')(mongoose);

const readyJobSchema = new mongoose.Schema({
    jobId: { type: Number },
  jobName: { type: String, required: true },
  testsToRun: [{ type: String, required: true }],
  resourcePool: { type: String, required: true },
  buildVersion: { type: String, required: true },
  jobRunType: { type: String, enum: ['Immediately', 'Scheduled'], required: true },
  scheduleType: { type: String, enum: ['One-Time Job', 'Reoccurring Job', '-'], default: '-' },
  scheduleTime: { type: String, default: '-' },
  priorityLevel: { type: Number, min: 1, max: 10, required: true },
  estimatedTime: { type: String, required: true },
  createdDate: { type: String, required: true },
  createdTime: { type: String, required: true },
  status: { type: String, default: 'Ready' },
  activationStatus: { type: String, default: 'Activated' },
  cluster: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster', default: null },
  resumeJob: { type: String, enum: ['Resume', 'Pause'], default: 'Resume', required: true },
  triggeredBy:{ type: String, required: true },
});

const ReadyJob = mongoose.model('ReadyJob', readyJobSchema);

module.exports = ReadyJob;
