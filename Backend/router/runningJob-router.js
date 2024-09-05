var express = require('express');
var router = express.Router();

var runningJobs = require('../controllers/runningJobs.js');

router.get('/getRunningJobs',runningJobs.getRunningJobs)// localhost:3000/Jobs/getRunningJobs


module.exports = router;