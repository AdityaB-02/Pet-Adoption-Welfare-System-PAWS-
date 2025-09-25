const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path if needed
const auth = require('../middleware/authMiddleware');

// Define the endpoint: GET /api/pets
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pets WHERE adoption_status = "Available"');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;