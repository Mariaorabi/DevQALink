// models/poolModel.js
const mongoose = require('mongoose');

const poolSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    clusters: [{ type: Schema.Types.ObjectId, ref: 'Cluster' }],
    status: { type: Boolean, required: true },
});

const Pool = mongoose.model('Pool', poolSchema);

module.exports = Pool;
