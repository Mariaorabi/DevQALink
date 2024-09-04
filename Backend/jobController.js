require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');
const connectDB = require('./config/database');

const Job = require('./models/job');
const Cluster = require('./models/cluster');
const Pool = require('./models/pool');
const phase3Job = require('./models/phase3Job');

// a ready job calls thing function
async function processJob(readyJob) {
    if (!readyJob) {
        console.error('Error: readyJob is null or undefined in processJob');
        return;
    }

    try {
        const pool = await Pool.findById(readyJob.pool);
        if (!pool) {
            console.error('Error: Pool not found for readyJob');
            return;
        }

        const cluster = await Cluster.findOne({ _id: { $in: pool.clusters }, status: 'available' });
        if (!cluster) {
            await handleReadyQueue(readyJob);
        } else {
            console.log("before alloc resources");
            const {job,readyJobCopy} = await allocateResources(cluster, readyJob);
            await runJob(job);
            await deallocateResources(cluster, job, readyJobCopy, pool);
        }
    } catch (error) {
        console.error('Error processing job:', error);
    }
}

async function allocateResources(cluster, readyJob) {
    console.log("in allocate res", cluster, readyJob);
    try {
        cluster.status = 'running';
        await cluster.save();

        console.log("Calling allocatePhase3Job..."); 
        const job = await allocatePhase3Job(readyJob,cluster); 
        console.log("Job returned from allocatePhase3Job:", job); 

        await job.save(); 
        console.log('Job and cluster are now running.');

        // Create a deep copy of readyJob before removal
        const readyJobCopy = JSON.parse(JSON.stringify(readyJob));

        console.log("readyJob before removal:", readyJob);
        if (readyJob.remove) {
            await readyJob.remove(); // If remove is available, use it
        } else {
            await Job.deleteOne({ _id: readyJob._id }); // Fallback to deleteOne
        }
        
        console.log("readyJob successfully removed.");
        return { job, readyJobCopy };
    } catch (error) {
        console.error('Error in allocateResources:', error); 
    }
}

async function allocatePhase3Job(readyJob,cluster){
    try {
        console.log("in allocate phase 3", readyJob);
        const job = new phase3Job({
            name: readyJob.name,
            tests: readyJob.tests,
            version: readyJob.version,
            status: 'running',
            cluster: cluster,  
            pool: readyJob.pool, 
            schedType: readyJob.schedType,
            estimatedRunTime: readyJob.estimatedRunTime,
            date: readyJob.date,
            triggeredBy: readyJob.triggeredBy,
            startTime: Date.now(),
            endTime: null,
            runtimeDuration: 0,
        });

        console.log("Job created in allocatePhase3Job:", job); 
        return job;
    } catch (error) {
        console.error('Error in allocatePhase3Job:', error); 
    }
    
}

async function runJob(runJob) {
    console.log(`Starting job: ${runJob.name}`);
    console.log(`Starting time: ${new Date()}`);

    // Simulate the running process for each test
    for (let i = 0; i < runJob.tests.length; i++) {
        const test = runJob.tests[i];
        
        console.log(`Running test ${i + 1}/${runJob.tests.length}: ${test}`);
        
        // Simulate the time taken by this test
        await simulateTestRun();

        // Simulate setting the test result
        runJob.testResults.push(`Test ${i + 1} result: Success`); // You can randomize or vary this result
        console.log(`Completed test ${i + 1}: ${test}`);
    }

    console.log(`Job ${runJob.name} completed.`);
}

function simulateTestRun() {
    return new Promise((resolve) => {
        // Simulate a test running for 1-3 seconds
        const time = Math.floor(Math.random() * 3000) + 1000;
        setTimeout(() => {
            console.log(`Simulated test ran for ${time}ms`);
            resolve();
        }, time);
    });
}

async function deallocateResources(cluster, currJob, readyJobCopy, pool) {
    currJob.endTime = new Date(); // Record the end time
    currJob.runtimeDuration = calculateDuration(currJob.startTime, currJob.endTime); // Calculate the runtime duration
    currJob.status = 'finished';
    await currJob.save();   

    if (!readyJobCopy) {
        console.error('readyJobCopy is undefined in deallocateResources');
        return; // Exit if readyJobCopy is undefined to prevent further errors
    }

    await handlCurrentJob(cluster, readyJobCopy);
    await deallocateCluster(cluster, pool);
}


async function handleReadyQueue(readyJob) {
    // nothing to do just remain it in the db without changes
}

function calculateDuration(startTime, endTime) {
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60000) % 60;
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}

async function handlCurrentJob(cluster,readyJobCopy){

    // look for the type of the job
    // check for readu job for this pool that is waiting
    if (!readyJobCopy) {
        console.error('readyJobCopy is undefined in handlCurrentJob');
        return; // Exit if readyJobCopy is undefined
    }

    console.log("readyJobCopy in handlCurrentJob:", readyJobCopy);
    
    if(readyJobCopy.schedType ==='reoccurring'){
        readyJobCopy.status = 'waiting';
        jobsHandler(readyJobCopy); /// function from scheduling team 
    }
}


async function jobsHandler(readyJobCopy) {
    // Save the readyJobCopy back to the database
    const newJob = new Job(readyJobCopy);
    await newJob.save();
}

async function deallocateCluster(cluster,pool){
    cluster.status = 'available';
    pool.status = true;
    await cluster.save();
    await pool.save();

    // find job from readyJobs that is waiting for an available cluster
    // assume that ready jobs are order as well
    await handleNextJob(pool._id);
}

async function handleNextJob(poolId){
    nextJob = await getJobByPoolAndStatus(poolId);
    await processJob(nextJob);
}

const getJobByPoolAndStatus = async (poolId) => {
    try {
      const job = await Job.findOne({ pool: poolId, status: 'ready' }).exec();
      return job;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  };


exports.processJob = processJob;