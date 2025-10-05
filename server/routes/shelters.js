const express = require('express');
const router = express.Router();

// 1. Use a single, clean import for the controller and middleware
const shelterController = require('../controllers/shelterController');
const auth = require('../middleware/authMiddleware'); // This is your correct auth middleware

// ==========================================================
// --- Public Routes (Accessible by anyone) ---
// ==========================================================

// Register a new shelter
// @route   POST /api/shelters/register
router.post('/register', shelterController.registerShelter);

// Login a shelter
// @route   POST /api/shelters/login
router.post('/login', shelterController.loginShelter);

// Get a shelter's public profile page by its ID
// @route   GET /api/shelters/:id
router.get('/:id', shelterController.getShelterProfileById);


// ==========================================================
// --- Private Shelter Routes (Require a valid shelter token) ---
// ==========================================================

// Get the logged-in shelter's own private profile details
// @route   GET /api/shelters/me
router.get('/me', auth, shelterController.getShelterProfile);

// Update the logged-in shelter's own profile
// @route   PUT /api/shelters/me
router.put('/me', auth, shelterController.updateShelterProfile);

// Get all pets for the logged-in shelter
// @route   GET /api/shelters/pets
router.get('/pets', auth, shelterController.getShelterPets);

// Get all donations for the logged-in shelter
// @route   GET /api/shelters/donations
router.get('/donations', auth, shelterController.getShelterDonations);

// Get all activities for the logged-in shelter
// @route   GET /api/shelters/activities
router.get('/activities', auth, shelterController.getShelterActivities);


module.exports = router;