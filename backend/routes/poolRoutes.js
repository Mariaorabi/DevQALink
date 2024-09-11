// routes/poolRoutes.js
const express = require('express');
const router = express.Router();
const poolController = require('../controllers/poolController');



router.get('/:poolId', poolController.getPoolById);
router.get('/', poolController.getPools);




module.exports = router;
