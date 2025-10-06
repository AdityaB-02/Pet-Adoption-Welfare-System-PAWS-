const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerShelter = async (req, res) => {
    // Note: In your frontend, ensure the form field is 'name', not 'shelter_name'
    const { name, email, password, address, capacity } = req.body;
    try {
        let [shelter] = await db.query('SELECT email FROM shelters WHERE email = ?', [email]);
        if (shelter.length > 0) {
            return res.status(400).json({ msg: 'Shelter with this email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        // Assuming your table column is 'name'
        const newShelter = { name, email, password_hash, address, capacity };
        const [result] = await db.query('INSERT INTO shelters SET ?', newShelter);
        const shelterId = result.insertId;
        const payload = { shelter: { id: shelterId } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const loginShelter = async (req, res) => {
    const { email, password } = req.body;
    try {
        let [shelterRows] = await db.query('SELECT * FROM shelters WHERE email = ?', [email]);
        if (shelterRows.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const shelter = shelterRows[0];
        const isMatch = await bcrypt.compare(password, shelter.password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const payload = { shelter: { id: shelter.shelter_id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getShelterPets = async (req, res) => {
    console.log("--- EXECUTING getShelterPets ---");
    try {
        const [pets] = await db.query('SELECT * FROM pets WHERE shelter_id = ? ORDER BY pet_id DESC', [req.shelter.id]);
        res.json(pets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getShelterProfile = async (req, res) => {
    try {
        const [shelters] = await db.query('SELECT shelter_id, shelter_name, email, address, capacity FROM shelters WHERE shelter_id = ?', [req.shelter.id]);
        if (shelters.length === 0) {
            return res.status(404).json({ msg: 'Shelter not found' });
        }
        res.json(shelters[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateShelterProfile = async (req, res) => {
    const { shelter_name, address, capacity } = req.body;
    try {
        await db.query('UPDATE shelters SET shelter_name = ?, address = ?, capacity = ? WHERE shelter_id = ?', [shelter_name, address, capacity, req.shelter.id]);
        res.json({ msg: 'Profile updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getShelterDonations = async (req, res) => {
    try {
        const [donations] = await db.query('SELECT * FROM donations WHERE shelter_id = ? ORDER BY donation_date DESC', [req.shelter.id]);
        res.json(donations);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const getShelterActivities = async (req, res) => {
    try {
        const [activities] = await db.query('SELECT * FROM activities WHERE shelter_id = ? ORDER BY activity_date DESC', [req.shelter.id]);
        res.json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const getShelterProfileById = async (req, res) => {
    try {
        const shelterId = req.params.id;
        const [details] = await db.query('SELECT shelter_id, shelter_name, email, address, capacity FROM shelters WHERE shelter_id = ?', [shelterId]);
        if (details.length === 0) {
            return res.status(404).json({ message: 'Shelter not found' });
        }
        const [pets] = await db.query("SELECT pet_id, name, species, breed, image_url FROM pets WHERE shelter_id = ? AND adoption_status = 'Available'", [shelterId]);
        const [activities] = await db.query('SELECT title, description, activity_date, location FROM activities WHERE shelter_id = ? ORDER BY activity_date DESC LIMIT 5', [shelterId]);
        const [donations] = await db.query("SELECT donation_type, donation_date FROM donations WHERE shelter_id = ? ORDER BY donation_date DESC LIMIT 10", [shelterId]);
        
        res.json({ details: details[0], pets, activities, donations });
    } catch (error) {
        console.error('Error fetching shelter profile:', error);
        res.status(500).send('Server Error');
    }
};

const addShelterActivity = async (req, res) => {
  try {
    const { title, description, activity_date, location } = req.body;
    const shelter_id = req.shelter.id; // From auth middleware

    // Simple validation
    if (!title || !description || !activity_date) {
      return res.status(400).json({ msg: 'Please provide a title, description, and date.' });
    }

    const newActivity = { shelter_id, title, description, activity_date, location };

    await db.query('INSERT INTO activities SET ?', newActivity);

    res.status(201).json({ msg: 'Activity created successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const addShelterDonation = async (req, res) => {
  try {
    const { donor_name, amount, donation_type, donation_date, notes } = req.body;
    const shelter_id = req.shelter.id;

    if (!donation_type || !donation_date) {
      return res.status(400).json({ msg: 'Donation type and date are required.' });
    }

    const newDonation = { shelter_id, donor_name, amount, donation_type, donation_date, notes };

    await db.query('INSERT INTO donations SET ?', newDonation);
    res.status(201).json({ msg: 'Donation recorded successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
    registerShelter,
    loginShelter,
    getShelterPets,
    getShelterProfile,
    updateShelterProfile,
    getShelterDonations,
    getShelterActivities,
    getShelterProfileById,
    addShelterActivity,
    addShelterDonation
};