// app.js
const express = require('express');
const mongoose = require('mongoose');
const waitingJobsRoutes = require('./router/waitingJobs.js');
const readyJobsRoutes = require('./router/readyJobs');
const poolsRoutes = require('./router/pools'); // Include the pools routes
const runningJobRoutes = require('./router/runningJob-router.js');

var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

app.use((req, res, next) => {  // CORS
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH'); // Allow specific HTTP methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    next();
});

// To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));

// To parse JSON data
app.use(bodyParser.json());

// For parsing multipart/form-data
app.use(upload.array());

const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Jobs', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Use routes
app.use('/jobs/waitingJobs', waitingJobsRoutes);
app.use('/jobs/readyJobs', readyJobsRoutes);
app.use('/pools', poolsRoutes); // Use the pools routes
app.use('/jobs',runningJobRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




/*var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const mongoose = require('mongoose');

// MongoDB connection URI (Corrected)
const mongoURI = 'mongodb://localhost:27017/executionDB'; // Correct URI with the '/'

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Log when connected
mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected');
});

// Log on error
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

app.use((req, res, next) => {  //CORS
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH'); // Allow specific HTTP methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    next();
});

// To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));

// To parse JSON data
app.use(bodyParser.json());

// For parsing multipart/form-data
app.use(upload.array()); 

// My Backend -----------------------------------------------------

var user = require('./router/runningJob-router.js');
app.use('/Jobs', user);  // localhost:3000/Jobs

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
*/