const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    ipAddress: { type: String, required: true },
    clusterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster' },
    isRunner: { type: Boolean, default: false }
});

module.exports = mongoose.model('Server', serverSchema);
