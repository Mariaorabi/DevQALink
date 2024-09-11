const mongoose = require('mongoose');
const connectDB = require('./dbVersion'); // Ensure the path is correct
const Version = require('./models/version'); // Make sure the 'V' is capitalized


const versions = [
    {
        versionNumber: '1.0.0',
        builds: [
            { buildId: "100" },
            { buildId: "101" },
            { buildId: "102" }
        ]
    },
    {
        versionNumber: '1.1.0',
        builds: [
            { buildId: "200" },
            { buildId: "201" }
        ]
    },
    {
        versionNumber: '2.0.0',
        builds: [
            { buildId: "300" },
            { buildId: "301" },
            { buildId: "302" },
            { buildId: "303" }
        ]
    }
];

const seedData = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        await Version.deleteMany({}); // Clear existing data
        await Version.insertMany(versions); // Insert new data
        console.log('Data successfully inserted');
        mongoose.connection.close(); // Close the connection
    } catch (error) {
        console.error('Error inserting data:', error);
    }
};

seedData();
