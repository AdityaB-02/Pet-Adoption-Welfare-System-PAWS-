const express = require('express');
const router = express.Router();

const shelterController = require('../controllers/shelterController');
const auth = require('../middleware/authMiddleware');

// ==========================================================
// --- Public Routes ---
// ==========================================================

router.post('/register', shelterController.registerShelter);
router.post('/login', shelterController.loginShelter);


// ==========================================================
// --- Private Shelter Routes (Order is important here!) ---
// ==========================================================

// Specific static routes MUST come before general dynamic routes.

// GET the logged-in shelter's own private profile details
router.get('/me', auth, shelterController.getShelterProfile);

// GET all pets for the logged-in shelter
router.get('/pets', auth, shelterController.getShelterPets);

// GET all donations for the logged-in shelter
router.get('/donations', auth, shelterController.getShelterDonations);

// GET all activities for the logged-in shelter
router.get('/activities', auth, shelterController.getShelterActivities);

// PUT (Update) the logged-in shelter's own profile
router.put('/me', auth, shelterController.updateShelterProfile);


// ==========================================================
// --- Dynamic routes MUST be last ---
// ==========================================================

// GET a shelter's public profile by its ID
// This is last so it doesn't accidentally catch requests for '/me', '/pets', etc.
router.get('/:id', shelterController.getShelterProfileById);


module.exports = router;