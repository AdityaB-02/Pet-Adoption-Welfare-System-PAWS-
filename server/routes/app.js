const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/appController');

// Define the public route for getting stats
router.get('/stats', getStats);

module.exports = router;