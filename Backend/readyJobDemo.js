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
      name: 'Test Job 1',
      id: 1,
      tests: ['test1', 'test2'],
      version: '1.0.0',
      priority: 5,
      status: 'ready',
      cluster: null,
      pool: '66cf0445e5c81c06a9488c7a',
      schedType: 'one-time',
      estimatedRunTime: 60,
      date: new Date(),
      triggeredBy: 'test1@gmail.com'
    });

    await readyJob.save();
    console.log('demo ready job data created successfully!');

  }catch(error){
    console.error('Error creating demo ready job:', error);
  }finally{
    mongoose.connection.close();
  }
}

createDemoReadyJob();
*/
  /*const readyJob2 = new Job({
    name: 'Test Job 2',
    id: 1,
    tests: ['test1', 'test2'],
    version: '1.0.0',
    priority: 5,
    status: 'ready',
    cluster: null,
    pool: '66cf0445e5c81c06a9488c7a',
    schedType: 'one-time',
    estimatedRunTime: 10,
    date: new Date(),
    triggeredBy: 'test2@gmail.com'
  });*/

  
async function startjob() {
  try{
    await connectDB();
    const job = await Job.findOne({ status: 'ready' }).sort({ date: 1 });
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

