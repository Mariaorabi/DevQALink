var express = require('express');
var router = express.Router();

var runningJobs = require('../../controllers/scheduler-controllers/runningJobs.js');

router.get('/getRunningJobs',runningJobs.getRunningJobs)// localhost:3000/Jobs/getRunningJobs

router.get('/getFinishJobs',runningJobs.getRunningJobs)// localhost:3000/Jobs/getFinishJobs

module.exports = router;