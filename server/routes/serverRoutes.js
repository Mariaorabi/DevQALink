const express = require('express');
const router = express.Router();
const { getServersByCluster } = require('../controllers/serverController');

// GET /servers/:clusterId
router.get('/:clusterId', getServersByCluster);

module.exports = router;
