const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  name: { type: String, required: true },
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
  triggeredBy:{ type: String, required: true },
});

module.exports = mongoose.model('Job', JobSchema);
