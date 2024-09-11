const mongoose = require('mongoose');

const poolSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photoUrl: { type: String, required: true },
    clusterIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cluster' }]
});

module.exports = mongoose.model('Pool', poolSchema);
