const mongoose = require('mongoose');
const Phase3Jobs = require('../../models/execution-models/phase3Job');


exports.getRunningJobs = async (req, res) => {
  try {
    const jobs = await Phase3Jobs.find();  // Fetch all jobs
    res.status(200).json(jobs);  // Return the jobs in the response
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
