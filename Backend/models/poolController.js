const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PoolControllerSchema = new Schema({
  id: { type: Number, required: true },
  pools: [{ type: Schema.Types.ObjectId, ref: 'Pool' }]
});

module.exports = mongoose.model('PoolController', PoolControllerSchema);
