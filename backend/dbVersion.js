const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://rinafdlahmd26:qj1p6HCgkgvkmrPa@cluster0.720fd.mongodb.net/Resources?VersionsretryWrites=true&w=majority&appName=Cluster0"
      // "mongodb+srv://hanenhabashi1:RPMuGyP7kg86JwWq@cluster0.qmbpj.mongodb.net/Versions?retryWrites=true&w=majority&appName=Cluster0",
    );
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
