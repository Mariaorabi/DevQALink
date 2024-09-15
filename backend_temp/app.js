// app.js
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
require('dotenv').config();
var upload = multer();

app.use((req, res, next) => {  //CORS
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH'); // Allow specific HTTP methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    next();
  });

//To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }))

//To parse json data
app.use(bodyParser.json())

// for parsing multipart/form-data
app.use(upload.array()); 

var auth = require('./router/auth-routers/auth-router.js')
app.use('/auth',auth);  // localhost:3000/auth


const waitingJobsRoutes = require('./router/scheduler-routers/waitingJobs.js');
const readyJobsRoutes = require('./router/scheduler-routers/readyJobs.js');
const poolsRoutes = require('./router/resources-routers/pools.js'); // Include the pools routes
const runningJobRoutes = require('./router/execution-routers/runningJob-router.js');
// Use routes
app.use('/jobs/waitingJobs', waitingJobsRoutes);
app.use('/jobs/readyJobs', readyJobsRoutes);
app.use('/pools', poolsRoutes); // Use the pools routes
app.use('/jobs',runningJobRoutes);

// Start the server
app.listen(process.env.Port, () => {
  console.log(`Server is running on port ${process.env.Port}`);
});