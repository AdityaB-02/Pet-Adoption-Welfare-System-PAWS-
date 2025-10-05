const express = require('express');
const router = express.Router();

// 1. Use a single, clean import for the controller and middleware
const petController = require('../controllers/petController');
const auth = require('../middleware/authMiddleware'); // Middleware for shelter authentication

// ==========================================================
// --- Public Routes (Accessible by anyone) ---
// ==========================================================

// GET all available pets (with filtering)
// Route: GET /api/pets
router.get('/', petController.getAllPets);

// GET a single pet's public details by ID
// Route: GET /api/pets/:id
router.get('/:id', petController.getPetById);


// ==========================================================
// --- Protected Routes (Require a valid shelter token) ---
// ==========================================================

// POST a new pet
// Route: POST /api/pets
router.post('/', auth, petController.addPet);

// PUT (update) a pet's details
// Route: PUT /api/pets/:id
router.put('/:id', auth, petController.updatePet);

// DELETE a pet
// Route: DELETE /api/pets/:id
router.delete('/:id', auth, petController.deletePet);

// POST a new vaccine for a specific pet
// Route: POST /api/pets/:id/vaccines
router.post('/:id/vaccines', auth, petController.addVaccineForPet);


module.exports = router;