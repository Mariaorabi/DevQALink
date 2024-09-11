const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  versionNumber: { type: String, required: true },
  builds: [
    {
      buildId: { type: String, required: true }
    }
  ]
});

const Version_temp = mongoose.model('Version', versionSchema);

module.exports = Version_temp;
