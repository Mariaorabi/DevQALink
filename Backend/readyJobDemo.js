require('dotenv').config();
const Job = require('./models/job');
const jobController = require('./jobController');
const mongoose = require('mongoose');
const connectDB = require('./config/database');

/*
async function createDemoReadyJob() {
  try {
    // Connect to the database
    await connectDB();


    const readyJob = new Job({
      name: 'Test Job 14',
      id: 1,
      tests: ['test12', 'test23'],
      version: '1.0.0',
      priority: 5,
      status: 'ready',
      cluster: null,
      pool: '66d5a8e34fddd005cc997415',
      schedType: 'one-time',
      estimatedRunTime: 60,
      date: new Date(),
      triggeredBy: 'test1@gmail.com'
    });

    const readyJob2 = new Job({
      name: 'Test Job 15',
      id: 1,
      tests: ['test5', 'test23'],
      version: '1.0.0',
      priority: 5,
      status: 'ready',
      cluster: null,
      pool: '66d5a8e34fddd005cc997415',
      schedType: 'one-time',
      estimatedRunTime: 10,
      date: new Date(),
      triggeredBy: 'test2@gmail.com'
    });

    await readyJob.save();
    await readyJob2.save();
    console.log('demo ready job data created successfully!');

  }catch(error){
    console.error('Error creating demo ready job:', error);
  }finally{
    mongoose.connection.close();
  }
}

createDemoReadyJob();

  

 
async function startjob() {
  try{
    await connectDB();
    const job = await Job.findOne({ status: 'Ready' }).sort({ date: 1 });
    if(job)
    await jobController.processJob(job);
  }catch(error){
    console.log('error: ' + error);
  }
  finally{
   //await mongoose.connection.close();

  }
}

startjob();

*/


async function start2jobspararell(){
    try {
      await connectDB();

  
      // Find two jobs that are ready
      const jobs = await Job.find({ status: 'Ready' }).sort({ date: 1 }).limit(2);
      console.log(jobs);
      if (jobs.length > 0) {
        // Process all jobs in parallel
        await Promise.all(jobs.map(job => jobController.processJob(job)));
      }
    } catch (error) {
      console.log('error: ' + error);
    } finally {
      //await mongoose.connection.close();
    }
  }

  start2jobspararell();