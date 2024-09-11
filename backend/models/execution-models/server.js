const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerSchema = new Schema({
  ip: { type: String, required: true }
});

module.exports = mongoose.model('Server', ServerSchema);
