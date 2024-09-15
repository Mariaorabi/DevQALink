// server.js
const express = require('express');
const mongoose = require('mongoose');
const waitingJobsRoutes = require('./routes/waitingJobs');
const readyJobsRoutes = require('./routes/readyJobs');
const poolsRoutes = require('./routes/pools'); // Include the pools routes
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
app.use('/jobs/runningJobs',runningJobRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
