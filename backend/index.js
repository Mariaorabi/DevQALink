// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();

// Initialize the Express app
const app = express();

app.use((req, res, next) => {  //CORS
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH'); // Allow specific HTTP methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
    next();
  });

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection URI
const uri = 'mongodb+srv://hanenhabashi1:RPMuGyP7kg86JwWq@cluster0.qmbpj.mongodb.net/Versions?retryWrites=true&w=majority&appName=Cluster0';
// const uri = "mongodb+srv://rinafdlahmd26:qj1p6HCgkgvkmrPa@cluster0.720fd.mongodb.net/Resources?VersionsretryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('MongoDB connection error: ', err));

// Define a Mongoose model (update with your schema)
const DataModel = mongoose.model('DataModel', new mongoose.Schema({
    name: String,
    value: String
}), 'versions'); // Replace 'yourCollectionName' with your actual collection name


// Route to fetch and display data
app.get('/', async (req, res) => {
    try {
        // Fetch data from MongoDB
        const data = await DataModel.find();
        // Send data as JSON response
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the server and listen on port 5000
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
