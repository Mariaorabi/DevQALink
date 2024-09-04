var mongoose = require('mongoose');
const getNextSequenceValue = require('../Utility/nextId');
const Counter = require('./counter-models');

// mongoose.connect('mongodb://localhost:27017/Customer');
//mongoose.connect('mongodb+srv://salehsh:SratWNyJDJiB1jcA@fsai.jxwnzzj.mongodb.net/?retryWrites=true&w=majority&appName=fsai');



const uri = process.env.MONGODB_URI;
// mongoose.connect(uri).then(() => {
//   console.log('Connected to database!')
// }).catch(() => {
//   console.log('Connection failed!')
// });
mongoose.connect(uri).then(async () => {
  console.log('Connected to database!');

  // Initialize the counter
  await Counter.findByIdAndUpdate(
    { _id: 'userId' },
    { $setOnInsert: { sequence_value: 0 } }, // Initialize to 0
    { upsert: true } // Create if it does not exist
  );

  console.log('Counter initialized.');
}).catch(() => {
  console.log('Connection failed!');
});
//mongoose.connect('mongodb+srv://salehsh:SratWNyJDJiB1jcA@fsai.jxwnzzj.mongodb.net/?retryWrites=true&w=majority&appName=fsai');

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true
  },
  fullName: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    enum: ['Software Tester', 'Software Developer'],
  }

});


const User = mongoose.model('User', userSchema);

module.exports = User;