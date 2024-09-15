const ReadyJob = require('../models/readyJobsModel');
const moment = require('moment-timezone');

// Handle POST request to add a new ready job
exports.addReadyJob = async (req, res) => {
    try {
        const {jobId, jobName, testsToRun, resourcePool, buildVersion, jobRunType, scheduleType, createdDate, createdTime, scheduleTime, priorityLevel, activationStatus, estimatedTime } = req.body;

        const newJob = new ReadyJob({
            jobId,
            jobName,
            testsToRun,
            resourcePool,
            buildVersion,
            jobRunType,
            scheduleType,
            scheduleTime,
            priorityLevel,
            estimatedTime,
            createdDate,
            createdTime,
            activationStatus,
            jobStatus: 'Ready'
        });
        
        const savedJob = await newJob.save();

        res.status(201).json({
            message: 'Job added successfully',
            job: savedJob
        });
    } catch (error) {
        console.error('Error saving ready job:', error);
        res.status(500).json({
            message: 'Error saving ready job',
            error: error.message
        });
    }
};

// exports.addReadyJobFromWaiting = async (req, res) => {

//     try {
//         const {jobId, jobName, testsToRun, resourcePool, buildVersion, jobRunType, scheduleType, scheduleTime, priorityLevel, estimatedTime, activationStatus } = req.body;

//         const newJob = new ReadyJob({
//             jobId,
//             jobName,
//             testsToRun,
//             resourcePool,
//             buildVersion,
//             jobRunType,
//             scheduleType,
//             scheduleTime,
//             priorityLevel,
//             estimatedTime,
//             createdDate,
//             createdTime,
//             jobStatus: 'Ready',
//             activationStatus
//         });

//         const savedJob = await newJob.save();

//         res.status(201).json({
//             message: 'Job added successfully',
//             job: savedJob
//         });
//     } catch (error) {
//         console.error('Error saving ready job:', error);
//         res.status(500).json({
//             message: 'Error saving ready job',
//             error: error.message
//         });
//     }
// };


exports.deleteJobById = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        console.log('jobId:', jobId);

        // Use findOneAndDelete to search by the jobId field and delete the document
        const deletedJob = await ReadyJob.findOneAndDelete({ jobId });
        console.log('deletedJob:', deletedJob);

        if (deletedJob) {
            res.status(200).json({
                message: 'Job deleted successfully',
                job: deletedJob
            });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({
            message: 'Error deleting job',
            error: error.message
        });
    }
};


exports.updateJobById = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const {
            jobName,
            testsToRun,
            resourcePool,
            buildVersion,
            jobRunType,
            scheduleType,
            scheduleTime,
            priorityLevel,
            // estimatedHours,
            // estimatedMinutes
            createdDate,
            createdTime,
            estimatedTime,
            activationStatus
        } = req.body;

        console.log("req body is: ", req.body); // Log entire request body
        console.log("jobId: ", jobId);
        console.log("jobName: ", jobName);
        console.log("testsToRun: ", testsToRun);
        console.log("resourcePool: ", resourcePool);
        console.log("buildVersion: ", buildVersion);
        console.log("jobRunType: ", jobRunType);
        console.log("scheduleType: ", scheduleType);
        console.log("scheduleTime: ", scheduleTime);
        console.log("priorityLevel: ", priorityLevel);
        console.log("createdDate: ", createdDate);
        console.log("createdTime: ", createdTime);
        console.log("estimatedTime: ", estimatedTime);
        console.log("activationStatus: ", activationStatus);


        // Create an object for fields that should be updated
        const updateFields = {};

        if (jobName !== undefined) updateFields.jobName = jobName;
        if (testsToRun !== undefined) updateFields.testsToRun = testsToRun;
        if (resourcePool !== undefined) updateFields.resourcePool = resourcePool;
        if (buildVersion !== undefined) updateFields.buildVersion = buildVersion;
        if (jobRunType !== undefined) updateFields.jobRunType = jobRunType;
        if (scheduleType !== undefined) {
            const validScheduleTypes = ['One-Time Job', 'Reoccurring Job'];
            updateFields.scheduleType = validScheduleTypes.includes(scheduleType) ? scheduleType : '-';
        }
        if (scheduleTime !== undefined) updateFields.scheduleTime = scheduleTime;
        if (priorityLevel !== undefined) updateFields.priorityLevel = priorityLevel;
        if (createdDate !== undefined) updateFields.createdDate = createdDate;
        if (createdTime !== undefined) updateFields.createdTime = createdTime;
        if (estimatedTime !== undefined) updateFields.estimatedTime = estimatedTime;
        if (activationStatus !== undefined) updateFields.activationStatus = activationStatus

        // Update the created date and time for tracking purposes
        // const nowInJerusalem = moment().tz('Asia/Jerusalem');
        // updateFields.createdDate = nowInJerusalem.format('YYYY-MM-DD');
        // updateFields.createdTime = nowInJerusalem.format('HH:mm:ss');

        // Use findOneAndUpdate to search by the jobId field and update the document
        const updatedJobDoc = await ReadyJob.findOneAndUpdate({ jobId }, updateFields, { new: true });

        if (updatedJobDoc) {
            res.status(200).json({
                message: 'Job updated successfully',
                job: updatedJobDoc
            });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({
            message: 'Error updating job',
            error: error.message
        });
    }
};

// Handle GET request to list all ready jobs
exports.getReadyJobs = async (req, res) => {
    try {
        // const readyJobs = await ReadyJob.find();
        const readyJobs = await ReadyJob.find().sort({ priorityLevel: -1 });

        res.status(200).json(readyJobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

