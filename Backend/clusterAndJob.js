//get a waiting job and assign it to available cluster in the pool

require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');
const connectDB = require('./config/database');

const Job = require('./models/job');
const Cluster = require('./models/cluster');
const Pool = require('./models/pool');
const ReportingService = require('./services/reportingService'); // Assume you have a service to handle reporting

async function processJob() {
  try {
    // Connect to the database
    await connectDB();

    // Get the first available job
    const job = await Job.findOne({ status: 'ready' }).sort({ date: 1 });

    if (!job) {
      console.log('No available job found.');
      return;
    }

    // Get the pool for the job
    const pool = await Pool.findById(job.pool);

    // Find an available cluster in the pool
    const cluster = await Cluster.findOne({ _id: { $in: pool.clusters }, status: 'available' });

    if (cluster) {
      const clusterTOShOw = await Cluster.findById(job.cluster).populate('servers').exec();
      const serverIps = clusterTOShOw.servers.map(server => server.ip);

      // Update the cluster status to 'running'
      cluster.status = 'running';
      await cluster.save();

      // Combine job and cluster
      job.cluster = cluster._id;
      job.status = 'running';
      job.startTime = new Date(); // Record the start time
      job.testResults = []; // Initialize the test results array
      await job.save();
      console.log('Job and cluster are now running.');

      // Here we imagine that Run the tests for the job
      await runJobTests(job);

      // Once the job is finished, update job status to 'finished' and update cluster status
      job.endTime = new Date(); // Record the end time
      job.runtimeDuration = calculateDuration(job.startTime, job.endTime); // Calculate the runtime duration
      job.status = 'finished';
      await job.remove(); // Remove job from the pool
     
      cluster.status = 'available';
      await cluster.save();
      console.log('Job finished and removed, cluster marked as available.');

      // Compile and send the results to the Reporting Team
      const reportData = {
        testDetails: job.test,
        versionBuild: job.version,
        clusterDetails: serverIps,
        testResults: job.testResults,
        runtimeDuration: job.runtimeDuration,
        date: job.date,
        triggeredBy: job.triggeredBy
      };
      

      await ReportingService.sendReport(reportData);
      console.log('Results sent to the Reporting Team.');

    } else {
      // No clusters available, set job status to 'waiting'
      job.status = 'waiting';
      await job.save();
      console.log('No available cluster found. Job is now waiting.');
    }
  } catch (error) {
    console.error('Error processing job:', error);
  } finally {
    // Ensure the database connection is closed after the operation
    mongoose.connection.close();
  }
}

// Function to simulate running tests for the job if tests estimated time les than the actual -->all tests fail הנחה
async function runJobTests(job) {
  const estimatedTime = job.estimatedTime; // The estimated time for the job
  const startTime = Date.now();

  for (let i = 0; i < job.tests.length; i++) {
    const test = job.tests[i];

    // Check if the estimated time has been exceeded
    if (Date.now() - startTime > estimatedTime) {
      console.log(`Estimated time exceeded. Marking remaining tests as failed.`);
      // Mark the remaining tests as failed
      for (let j = i; j < job.tests.length; j++) {
        job.testResults.push('fail');
      }
      break;

    }

    // Simulate running the test!!!!!!!!!!! (replace with actual test logic)
    const testResult = await runTest(test);

    // Store the test result
    job.testResults.push(testResult);
  }

  // Save the job with updated test results
  await job.save();
}

// Simulated function to run a single test
async function runTest(test) {
  // Simulate a delay for the test processing (replace with real test execution)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate a test result (replace with real result)
  return Math.random() > 0.5 ? 'pass' : 'fail'; // Randomly pass or fail
}

// Function to calculate the duration between two dates
function calculateDuration(startTime, endTime) {
  const durationMs = endTime - startTime;
  const minutes = Math.floor(durationMs / 60000) % 60;
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

// Run the function to process the job
processJob();
