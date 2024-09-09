require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');
const connectDB = require('./config/database');

const Job = require('./models/readyJobsModel');
const Cluster = require('./models/cluster');
const Pool = require('./models/pool');
const phase3Job = require('./models/phase3Job');
const WaitingJob = require('./models/waitingJobsModel');


// a ready job calls thing function
async function processJob(readyJob) {
    if (!readyJob) {
        console.error('Error: readyJob is null or undefined in processJob');
        return;
    }

    try {
        //const pool = await Pool.findById(readyJob.pool);

        const pool = await Pool.findOne({ name: new RegExp(`^${readyJob.resourcePool}$`, 'i') });
        if (!pool) {
            console.error('Error: Pool not found for readyJob');
            return;
        }
        

        const cluster = await Cluster.findOne({ _id: { $in: pool.clusters }, status: 'available' });

        if (!cluster) {
            await handleReadyQueue(readyJob);
        } else {
            console.log("before alloc resources");
            const {job,readyJobCopy} = await allocateResources(cluster, readyJob, pool._id);
            await runJob(job);
            await deallocateResources(cluster, job, readyJobCopy, pool);
        }
    } catch (error) {
        console.error('Error processing job:', error);
    }
}

async function allocateResources(cluster, readyJob, poolId) {
    console.log("in allocate res", cluster, readyJob);
    try {
        cluster.status = 'running';
        await cluster.save();

        console.log("Calling allocatePhase3Job..."); 
        const job = await allocatePhase3Job(readyJob,cluster,poolId); 
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

async function allocatePhase3Job(readyJob,cluster,poolId){
    try {
        console.log("in allocate phase 3", readyJob);
        const job = new phase3Job({
            name: readyJob.jobName,
            tests: readyJob.testsToRun,
            version: readyJob.buildVersion,
            status: 'running',
            cluster: cluster,  
            pool: poolId, 
            schedType: readyJob.scheduleType,
            estimatedRunTime: readyJob.estimatedTime,
            date: readyJob.createdDate,
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
    //add start run time 
    // expected
    // overall run > 1.5 * expected stop the loop and mark the test as fail + "time out exceeded

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
        const time = Math.floor(Math.random() * 10000) + 1000;
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
    
    if(readyJobCopy.scheduleType ==='Reoccurring Job'){
        //readyJobCopy.status = 'Waiting';
        await jobsHandler(readyJobCopy); /// function from scheduling team 
    }
}


async function jobsHandler(readyJobCopy) {
    // Save the readyJobCopy as new waiting job back to the database
    const newWaitingJob = new WaitingJob({
        jobName: readyJobCopy.jobName,
        testsToRun: readyJobCopy.testsToRun,
        resourcePool: readyJobCopy.resourcePool,
        buildVersion: readyJobCopy.buildVersion,
        jobRunType: readyJobCopy.jobRunType,
        scheduleType: readyJobCopy.scheduleType,
        scheduleTime: readyJobCopy.scheduleTime,
        priorityLevel: readyJobCopy.priorityLevel,
        estimatedTime: readyJobCopy.estimatedTime,
        createdDate: readyJobCopy.createdDate,
        createdTime: readyJobCopy.createdTime,
        status: 'Waiting',
        activationStatus: readyJobCopy.activationStatus
    }); 

    await newWaitingJob.save();
}

async function deallocateCluster(cluster,pool){
    cluster.status = 'available';
    pool.status = true;
    await cluster.save();
    await pool.save();

    // find job from readyJobs that is waiting for an available cluster
    // assume that ready jobs are order as well
    await handleNextJob(pool.name);
}

async function handleNextJob(poolName){
    console.log('in handle next job');
    nextJob = await getJobByPoolAndStatus(poolName);
    await processJob(nextJob);
}

const getJobByPoolAndStatus = async (poolName) => {
    try {
      const job = await Job.findOne({ resourcePool: poolName, status: 'Ready' }).exec();
      console.log('next job' + job);
      return job;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  };


exports.processJob = processJob;