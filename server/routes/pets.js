const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController'); // 1. Import the controller
const auth = require('../middleware/authMiddleware');

// --- Public Routes ---

// GET all available pets (Updated to use the controller)
router.get('/', petController.getAllPets);

// GET a single pet by ID (This is the new line)
router.get('/:id', petController.getPetById);


// --- Protected Routes for Shelters ---

// POST (add) a new pet
router.post('/', auth, petController.addPet);

// PUT (update) a pet
router.put('/:id', auth, petController.updatePet);

// DELETE a pet
router.delete('/:id', auth, petController.deletePet);


module.exports = router;