const mongoose = require('mongoose');

const clusterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serverIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }],
    poolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pool' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' } // Add status field with default 'active'
});

module.exports = mongoose.model('Cluster', clusterSchema);
