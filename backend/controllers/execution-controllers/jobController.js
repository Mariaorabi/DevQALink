require('dotenv').config(); // Load environment variables

const mongoose = require('mongoose');
const connectDB = require('../../config/database');

const Job = require('../../models/execution-models/readyJobsModel');
const Cluster = require('../../models/resources-models/cluster');
const Pool = require('../../models/resources-models/pool');
const phase3Job = require('../../models/execution-models/phase3Job');
const WaitingJob = require('../../models/scheduler-models/waitingJobsModel');


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
            const {job,readyJobCopy} = await allocateResources(cluster, readyJob, pool.id,pool.name);
            await runJob(job);
            await deallocateResources(cluster, job, readyJobCopy, pool);
        }
    } catch (error) {
        console.error('Error processing job:', error);
    }
}

async function allocateResources(cluster, readyJob, poolId,poolName) {
   // console.log("in allocate res", cluster, readyJob);
    try {
        cluster.status = 'running';
        await cluster.save();

        //console.log("Calling allocatePhase3Job..."); 
        const job = await allocatePhase3Job(readyJob,cluster,poolId,poolName); 
       // console.log("Job returned from allocatePhase3Job:", job); 

        await job.save(); 
      //  console.log('Job and cluster are now running.');

        // Create a deep copy of readyJob before removal
        const readyJobCopy = JSON.parse(JSON.stringify(readyJob));
       // console.log("readyJob before removal:", readyJob);
        if (readyJob.remove) {
            await readyJob.remove(); // If remove is available, use it
        } else {
            await Job.deleteOne({ _id: readyJob._id }); // Fallback to deleteOne
        }
        
      //  console.log("readyJob successfully removed.");
        return { job, readyJobCopy };
    } catch (error) {
        console.error('Error in allocateResources:', error); 
    }
}

async function allocatePhase3Job(readyJob,cluster,poolId,poolName){
    try {
        console.log("in allocate phase 3", readyJob);
        const job = new phase3Job({
            name: readyJob.jobName,
            tests: readyJob.testsToRun,
            version: readyJob.buildVersion,
            status: 'running',
            cluster: cluster,  
            pool: poolName, 
            schedType: readyJob.scheduleType,
            estimatedRunTime: readyJob.estimatedTime,
            date: readyJob.createdDate,
            triggeredBy: readyJob.triggeredBy,
            startTime: Date.now(),
            endTime: null,
            runtimeDuration: 0,
            jobId: readyJob.jobId
        });

        console.log("Job created in allocatePhase3Job:", job); 
        return job;
    } catch (error) {
        console.error('Error in allocatePhase3Job:', error); 
    }
    
}


async function runJob(runJob) {
    console.log(`Starting job: ${runJob.name}`);
    const startTime = new Date();
    console.log(`Starting time: ${startTime}`);
    
    const expectedRuntimeMs = parseEstimatedRunTime(runJob.estimatedRunTime || "0h 0m");
    const maxRuntime = 1.5 * expectedRuntimeMs; // 1.5 times the expected runtime

    // Simulate the running process for each test
    for (let i = 0; i < runJob.tests.length; i++) {
        const test = runJob.tests[i];
        
        console.log(`Running test ${i + 1}/${runJob.tests.length}: ${test}`);

        // Check if overall run time has exceeded the max runtime
        const currentTime = new Date();
        const elapsedTime = currentTime - startTime;
        if (elapsedTime > maxRuntime) {
            console.log(`Test ${i + 1} timed out: Total run time exceeded allowed time.`);
            runJob.testResults.push(`Test ${i + 1} result: Failure (Time Out Exceeded)`);
            await runJob.save();
            continue; 
        }

        // Simulate the time taken by this test
        await simulateTestRun();

        // Randomize test result (Success or Failure)
        const testResult = Math.random() > 0.5 ? 'Success' : 'Failure';
        runJob.testResults.push(`${testResult}`);
        await runJob.save();
        console.log(`Completed test ${i + 1}: ${test} - Result: ${testResult}`);
    }

    const endTime = new Date();
    console.log(`Job ${runJob.name} completed.`);
    console.log(`Total run time: ${(endTime - startTime) / 1000} seconds`);
}

function parseEstimatedRunTime(estimatedRunTime) {
    const timeRegex = /(\d+)h\s*(\d+)m/;
    const match = estimatedRunTime.match(timeRegex);
    if (!match) {
        throw new Error('Invalid estimatedRunTime format');
    }

    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    
    // Convert the hours and minutes to milliseconds
    const totalMilliseconds = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
    
    return totalMilliseconds;
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
        activationStatus: readyJobCopy.activationStatus,
        resumeJob: readyJobCopy.resumeJob,
        triggeredBy:readyJobCopy.triggeredBy,
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
      //const readyJobs = await Job.find().sort({ resourcePool: poolName, priorityLevel: -1 });
      
      const jobs = await Job.find({ resourcePool: poolName, status: 'Ready' }).exec();
      console.log( "getJobByPoolAndStatus before sort" + jobs);
      const readyJobs = jobs.sort((a, b) => b.priorityLevel - a.priorityLevel);
      console.log( "getJobByPoolAndStatus after sort" + readyJobs);
      //console.log('next job' + job);
      /*for(var j in readyJobs){
        if(j.resumeJob === "Resume") return j;
      }
      return /*readyJobs.length>0 ?  readyJobs[0] : null;*/
      const resumeJob = readyJobs.find(j => j.resumeJob === "Resume");
    
        return resumeJob || null;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  };


exports.processJob = processJob;