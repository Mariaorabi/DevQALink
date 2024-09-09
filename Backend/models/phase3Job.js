const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Phase3Job = new Schema({
  name: { type: String, required: true },
  tests: [{ type: String }],
  version: { type: String, required: true },
  status: { type: String, required: true },
  cluster: { type: Schema.Types.ObjectId, ref: 'Cluster', default: null },  
  pool: { type: Schema.Types.ObjectId, ref: 'Pool', default: null }, 
  schedType: { type: String, required: true },
  estimatedRunTime: { type: String, required: true },
  date: { type: Date, default: Date.now },
  triggeredBy:{ type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  runtimeDuration: { type: String},
  testResults:[{ type: String }],
});

module.exports = mongoose.model('phase3Job', Phase3Job);
