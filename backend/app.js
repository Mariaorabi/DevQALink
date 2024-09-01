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

// My Backend -----------------------------------------------------

var auth = require('./router/auth-router')

var resources = require('./router/resources-router')

var scheduler = require('./router/scheduler-router')

var execution = require('./router/execution-router')

var reports = require('./router/reports-router')
//app.use('/student',student);  // localhost:3000/student
app.use('/auth',auth);  // localhost:3000/auth


app.use('/resources', resources) // localhost:3000/resources

app.use('/scheduler', scheduler) // localhost:3000/scheduler

app.use('/execution', execution) // localhost:3000/execution

app.use('/reports', reports) // localhost:3000/reports


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});