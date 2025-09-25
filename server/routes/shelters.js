const express = require('express');
const router = express.Router();
const shelterController = require('../controllers/shelterController');

// @route   POST api/shelters/register
router.post('/register', shelterController.registerShelter);

// @route   POST api/shelters/login
router.post('/login', shelterController.loginShelter);

module.exports = router;