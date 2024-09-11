const mongoose = require('mongoose');
const Server = require('./models/server');
const Cluster = require('./models/cluster');
const Pool = require('./models/pool');
const connectDB = require('./dbArchitecture');

const seedData = async () => {
    try {
        await connectDB(); // Connect to DB before seeding

        // Check if there are existing pools
        const existingPools = await Pool.countDocuments();
        if (existingPools > 0) {
            console.log('Data already exists. Skipping seeding.');
            return; // Exit the script if data already exists
        }

        // Clear existing data
        await Server.deleteMany({});
        await Cluster.deleteMany({});
        await Pool.deleteMany({});

        // Create Pools
        const ssdPool = new Pool({ name: "SSD Pool", photoUrl: "https://leeharveycomputing.co.uk/wp-content/uploads/2020/01/HDD-vs-SSD.jpg" });
        const hddPool = new Pool({ name: "HDD Pool", photoUrl: "https://cdn.pixabay.com/photo/2019/07/05/09/56/hdd-4318171_1280.jpg" });

        await ssdPool.save();
        await hddPool.save();

        // Create Clusters with a default status
        const clusters = [];
        for (let i = 1; i <= 6; i++) {
            clusters.push(new Cluster({ name: `Cluster ${i}`, status: 'active', poolId: ssdPool._id }));
        }

        for (let i = 7; i <= 12; i++) {
            clusters.push(new Cluster({ name: `Cluster ${i}`, status: 'inactive', poolId: hddPool._id }));
        }

        await Cluster.insertMany(clusters);

        // Assign clusters to pools
        ssdPool.clusterIds = clusters.slice(0, 6).map(cluster => cluster._id);
        hddPool.clusterIds = clusters.slice(6).map(cluster => cluster._id);

        await ssdPool.save();
        await hddPool.save();

        // Create Servers and assign to clusters
        const servers = [];
        for (let i = 1; i <= 60; i++) {
            const server = new Server({
                ipAddress: `192.168.1.${i}`,
                clusterId: clusters[Math.floor((i - 1) / 5)]._id,
                isRunner: i % 5 === 1 // First server in each cluster is the runner
            });
            servers.push(server);
        }

        await Server.insertMany(servers);

        // Update clusters with server IDs
        for (let i = 0; i < clusters.length; i++) {
            clusters[i].serverIds = servers.filter(server => server.clusterId.equals(clusters[i]._id)).map(server => server._id);
            await clusters[i].save();
        }

        console.log('Data seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
