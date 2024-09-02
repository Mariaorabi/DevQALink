const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PoolSchema = new Schema({
  id: { type: Number, required: true },
  clusters: [{ type: Schema.Types.ObjectId, ref: 'Cluster' }],
  status: { type: Boolean, required: true }
});

module.exports = mongoose.model('Pool', PoolSchema);
