const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
require('./seed'); // Automatically runs the seed script
const upload = multer();
const app = express();
const port = 3030;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));

// To parse JSON data
app.use(bodyParser.json());

// For parsing multipart/form-data
app.use(upload.array()); 

// Routes for pools, clusters, and servers
const poolRoutes = require('./routes/poolRoutes');
const clusterRoutes = require('./routes/clusterRoutes');
const serverRoutes = require('./routes/serverRoutes');

app.use('/pools', poolRoutes);        // Routes for managing pools
app.use('/clusters', clusterRoutes);  // Routes for managing clusters
app.use('/servers', serverRoutes);    // Routes for managing servers


// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
