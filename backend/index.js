const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express();

// Set up CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH'); // Allow specific HTTP methods
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  next();
});

// Set up multer for multipart/form-data
const upload = multer();

// Middleware to parse URL-encoded and JSON data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Parse application/json

// Middleware to handle multipart/form-data (if you're using file uploads)
app.use(upload.array());

// MongoDB connection
const dbURI = 'mongodb://localhost:27017/phase3jobs';  // MongoDB URI
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Define a schema for reports
const reportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tests: [{ type: String }],  // Array of test names or IDs
  version: { type: String, required: true },
  status: { type: String, required: true },
  cluster: { type: mongoose.Schema.Types.ObjectId, ref: 'Cluster', required: true },  // Assuming `cluster` is a reference to another collection
  pool: { type: mongoose.Schema.Types.ObjectId, ref: 'Pool', required: true },  // Assuming `pool` is a reference to another collection
  schedType: { type: String, required: true },
  estimatedRunTime: { type: String, required: true },
  date: { type: Date, required: true },  // The date field is stored as a Date object
  triggeredBy: { type: String, required: true },
  startTime: { type: Date },  // Start time as Date object
  endTime: { type: Date },  // End time as Date object
  runtimeDuration: { type: String },  // Duration as string
  testResults: [{ type: String }]
});

// Create a model for reports
const Report = mongoose.model('phase3jobs', reportSchema);

// API endpoint to retrieve reports from MongoDB
app.get('/api/reports', async (req, res) => {
  try {
    console.log("Fetching reports from MongoDB...");
    const reports = await Report.find(); // Fetch all reports from the database
    console.log("Reports fetched: ", reports);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
