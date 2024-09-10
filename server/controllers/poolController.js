const Pool = require('../models/pool');

const getPools = async (req, res) => {
    try {
        const pools = await Pool.find();
        res.json(pools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPoolById = async (req, res) => {
    try {
        const poolId = req.params.poolId;
        const pool = await Pool.findById(poolId).populate('clusterIds'); // Optional: populate clusterIds if needed

        if (!pool) {
            return res.status(404).json({ message: 'Pool not found' });
        }

        res.json(pool);
    } catch (error) {
        console.error('Error fetching pool:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getPoolById,
    getPools};