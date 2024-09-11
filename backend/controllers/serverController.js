const Server = require('../models/server');
const Cluster = require('../models/cluster');

exports.getServersByCluster = async (req, res) => {
    try {
        const clusterId = req.params.clusterId;
        const cluster = await Cluster.findById(clusterId);

        if (!cluster) {
            return res.status(404).json({ message: 'Cluster not found' });
        }

        // Fetch servers associated with the cluster
        const servers = await Server.find({ _id: { $in: cluster.serverIds } });
        res.json(servers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
