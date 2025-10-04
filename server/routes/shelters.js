const express = require('express');
const router = express.Router();
const shelterController = require('../controllers/shelterController');
const auth = require('../middleware/authMiddleware');

// @route   POST api/shelters/register
router.post('/register', shelterController.registerShelter);

// @route   POST api/shelters/login
router.post('/login', shelterController.loginShelter);
router.get('/pets', auth, shelterController.getShelterPets);

router.get('/me', auth, shelterController.getShelterProfile);
router.put('/me', auth, shelterController.updateShelterProfile);

module.exports = router;