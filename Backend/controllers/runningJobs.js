const mongoose = require('mongoose');
const Phase3Jobs = require('../models/phase3Job');
const finishJob = require('../models/finishJob');


exports.getRunningJobs = async (req, res) => {
  try {
    const jobs = await Phase3Jobs.find();  // Fetch all jobs
    res.status(200).json(jobs);  // Return the jobs in the response
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
exports.getFinishJobs = async (req, res) => {
  try {
    const jobs = await finishJob.find();  // Fetch all jobs
    res.status(200).json(jobs);  // Return the jobs in the response
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};