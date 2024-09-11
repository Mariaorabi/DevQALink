const mongoose = require('mongoose');
const Cluster = require('./models/cluster');

async function getFirstServerIp(clusterId) {
  try {
    // Find the cluster by its ID and populate the servers array
    const cluster = await Cluster.findOne({ id: clusterId }).populate('servers').exec();

    // Check if the servers array is not empty and get the IP of the first server
    if (cluster.servers.length > 0) {
      const firstServerIp = cluster.servers[0].ip;
      return firstServerIp;
    } else {
      console.log('No servers found in the cluster');
      return null;
    }
  } catch (err) {
    console.error('Error retrieving first server IP:', err);
    return null;
  }
}