const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  /*name: { type: String, required: true },
  id: { type: Number, required: true },
  tests: [{ type: String }],
  version: { type: String, required: true },
  priority: { type: Number, required: true },
  status: { type: String, required: true },
  cluster: { type: Schema.Types.ObjectId, ref: 'Cluster', default: null },  
  pool: { type: Schema.Types.ObjectId, ref: 'Pool', default: null }, 
  schedType: { type: String, required: true },
  estimatedRunTime: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  triggeredBy:{ type: String, required: true },*/
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
  cluster: { type: Schema.Types.ObjectId, ref: 'Cluster', default: null },
  triggeredBy:{ type: String, required: true },
});

module.exports = mongoose.model('ReadyJob', JobSchema);

/*
  jobId: { type: Number },
    jobName: { type: String, required: true },
    testsToRun: [{ type: String, required: true }],
    resourcePool: { type: String, required: true },
    buildVersion: { type: String, required: true },
    jobRunType: { type: String, enum: ['Immediately', 'Scheduled'], required: true },
    scheduleType: { type: String, enum: ['One-Time Job', 'Reoccurring Job', '-'], default: '-'},
    scheduleTime: { type: String, default: '-' },
    priorityLevel: { type: Number, min: 1, max: 10, required: true },
    estimatedTime: { type: String, required: true },
    createdDate: { type: String, required: true },
    createdTime: { type: String, required: true },
    status: { type: String, default: 'Ready' },
    activationStatus: { type: String, default: 'Activated' }
*/