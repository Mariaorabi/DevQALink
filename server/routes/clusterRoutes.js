const express = require('express');
const router = express.Router();
const { getClustersByPool } = require('../controllers/clusterController');

// GET /clusters/:poolId
router.get('/:poolId', getClustersByPool);

module.exports = router;
