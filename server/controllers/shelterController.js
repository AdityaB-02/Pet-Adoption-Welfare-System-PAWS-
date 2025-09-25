const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @desc    Register a new shelter
 * @route   POST /api/shelters/register
 */
exports.registerShelter = async (req, res) => {
  const { shelter_name, email, password, address, capacity } = req.body;

  try {
    // Check if a shelter with this email already exists
    let [shelter] = await db.query('SELECT email FROM shelters WHERE email = ?', [email]);
    if (shelter.length > 0) {
      return res.status(400).json({ msg: 'Shelter with this email already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create the new shelter object
    const newShelter = {
      shelter_name,
      email,
      password_hash,
      address,
      capacity
    };

    // Insert the new shelter into the database
    const [result] = await db.query('INSERT INTO shelters SET ?', newShelter);
    const shelterId = result.insertId;

    // Create a JSON Web Token (JWT) for immediate login
    const payload = {
      user: {
        id: shelterId,
        type: 'shelter' // Useful for role-based access later
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' }, // Token expires in 5 hours
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

/**
 * @desc    Authenticate a shelter and get a token
 * @route   POST /api/shelters/login
 */
exports.loginShelter = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if a shelter with that email exists
        let [shelterRows] = await db.query('SELECT * FROM shelters WHERE email = ?', [email]);
        if (shelterRows.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const shelter = shelterRows[0];

        // Compare the submitted password with the stored hash
        const isMatch = await bcrypt.compare(password, shelter.password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // If credentials are correct, create and return a JWT
        const payload = {
            user: {
                id: shelter.shelter_id,
                type: 'shelter'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

/**
 * @desc    Get all pets for the logged-in shelter
 * @route   GET /api/shelters/pets
 * @access  Private
 */
exports.getShelterPets = async (req, res) => {
  try {
    // req.shelter.id is added to the request object by the authMiddleware
    const [pets] = await db.query('SELECT * FROM pets WHERE shelter_id = ? ORDER BY pet_id DESC', [req.shelter.id]);
    res.json(pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};