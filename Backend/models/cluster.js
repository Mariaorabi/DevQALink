const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClusterSchema = new Schema({
  id: { type: Number, required: true },
  status: { type: String, required: true },
  servers: [{ type: Schema.Types.ObjectId, ref: 'Server' }]
});

module.exports = mongoose.model('Cluster', ClusterSchema);
