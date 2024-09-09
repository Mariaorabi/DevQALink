require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/database');

// Import models
const Server = require('./models/server');
const Cluster = require('./models/cluster');
const Pool = require('./models/pool');
const Job = require('./models/job');
const PoolController = require('./models/poolController');

// Function to create demo data
async function createDemoData() {
  try {
    // Connect to the database
    await connectDB();

    // Create Servers
    const server1 = new Server({ ip: '192.168.1.1' });
    const server2 = new Server({ ip: '192.168.1.2' });
    const server3 = new Server({ ip: '192.168.1.3' });
    const server4 = new Server({ ip: '192.168.1.4' });
    const server5 = new Server({ ip: '192.168.1.5' });

    await server1.save();
    await server2.save();
    await server3.save();
    await server4.save();
    await server5.save();

    // Create Clusters
    const cluster1 = new Cluster({ id: 1, status: 'available', servers: [server1._id, server2._id] });
    const cluster2 = new Cluster({ id: 2, status: 'available', servers: [server3._id, server4._id] });
    const cluster3 = new Cluster({ id: 3, status: 'available', servers: [server5._id] });

    await cluster1.save();
    await cluster2.save();
    await cluster3.save();

    // Create Pools
    /*const pool1 = new Pool({ id: 1, clusters: [cluster1._id, cluster2._id], status: true });
    const pool2 = new Pool({ id: 2, clusters: [cluster3._id], status: true });*/

    const pool1 = new Pool({
      name : "HHD Pool",
      clusters: [cluster1._id, cluster2._id], 
      status: true 
    })

    const pool2 = new Pool({
      name: "SDD Pool",
      clusters: [cluster3._id], 
      status: true,
    })

    await pool1.save();
    await pool2.save();

    // Create Jobs

    const job1 = new Job({
      jobId: 1,
      jobName: "Job One",
      testsToRun: ["Test1", "Test2"],
      resourcePool: "SSD Pool",
      buildVersion: "v1.0.0",
      jobRunType: "Immediately",
      scheduleType: "-",
      scheduleTime: "-",
      priorityLevel: 5,
      estimatedTime: "2h",
      createdDate: "2024-09-08",
      createdTime: "10:00 AM",
      status: "Ready",
      activationStatus: "Activated",
      cluster: null,
      triggeredBy: "Admin"
    });
    
    const job2 = new Job({
      jobId: 2,
      jobName: "Job Two",
      testsToRun: ["Test3", "Test4"],
      resourcePool: "HDD Pool",
      buildVersion: "v1.2.0",
      jobRunType: "Scheduled",
      scheduleType: "Reoccurring Job",
      scheduleTime: "2024-09-09 12:00 PM",
      priorityLevel: 8,
      estimatedTime: "1.5h",
      createdDate: "2024-09-08",
      createdTime: "11:00 AM",
      status: "Ready",
      activationStatus: "Activated",
      cluster: null,
      triggeredBy: "System"
    });
    
    const job3 = new Job({
      jobId: 3,
      jobName: "Job Three",
      testsToRun: ["Test5", "Test6", "Test7"],
      resourcePool: "SSD Pool",
      buildVersion: "v1.3.0",
      jobRunType: "Immediately",
      scheduleType: "-",
      scheduleTime: "-",
      priorityLevel: 3,
      estimatedTime: "3h",
      createdDate: "2024-09-08",
      createdTime: "12:00 PM",
      status: "Ready",
      activationStatus: "Activated",
      cluster: null,
      triggeredBy: "Developer"
    });
    /*const job1 = new Job({
      name: 'Test Job 1',
      id: 1,
      tests: ['test1', 'test2'],
      version: '1.0.0',
      priority: 5,
      status: 'waiting',
      cluster: null,
      pool: pool2._id,
      schedType: 'one-time',
      estimatedRunTime: 60,
      date: new Date(),
      triggeredBy: 'test1@gmail.com'
    });

    const job2 = new Job({
      name: 'Test Job 2',
      id: 2,
      tests: ['test3', 'test4'],
      version: '2.0.0',
      priority: 8,
      status: 'waiting',
      cluster: null,
      pool: pool1._id,
      schedType: 'reoccurring',
      estimatedRunTime: 120,
      date: new Date(),
      triggeredBy: 'test@gmail.com'
    });

    const job3 = new Job({
      name: 'Test Job 3',
      id: 3,
      tests: ['test5'],
      version: '1.1.0',
      priority: 3,
      status: 'waiting',
      cluster: null,
      pool: pool1._id,
      schedType: 'one-time',
      estimatedRunTime: 45,
      date: new Date(),
      triggeredBy: 'test2@gmail.com'
    });
*/
    await job1.save();
    await job2.save();
    await job3.save();

    // Create Pool Controller
    /*const poolController1 = new PoolController({ id: 1, pools: [pool1._id, pool2._id] });
    await poolController1.save();*/

    console.log('Demo data created successfully!');

  } catch (error) {
    console.error('Error creating demo data:', error);
  } finally {
    // Ensure the database connection is closed after the operation
    mongoose.connection.close();
  }
}

// Run the Seed Data Function
createDemoData();
