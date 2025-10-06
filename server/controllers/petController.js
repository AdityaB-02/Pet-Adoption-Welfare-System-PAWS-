const db = require('../config/db');

// @desc    Get all available pets with filtering
// @route   GET /api/pets
// @access  Public
const getAllPets = async (req, res) => {
    try {
        const { species,  min_age, max_age, gender, search } = req.query;
        let query = `
            SELECT p.pet_id, p.name, p.species, p.breed, p.image_url, p.description 
            FROM pets p 
            WHERE p.adoption_status = 'Available'
        `;
        const params = [];

        if (species) {
            query += ' AND p.species = ?';
            params.push(species);
        }
        if (search) {
            query += ' AND (p.name LIKE ? OR p.species LIKE ? OR p.breed LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

         if (min_age) {
         query += ' AND age >= ?';
         params.push(parseInt(min_age));
        }
         if (max_age) {
         query += ' AND age <= ?';
         params.push(parseInt(max_age));
        }
         if (gender && gender.trim() !== '') {
         query += ' AND gender = ?';
         params.push(gender);
        }   

        const [pets] = await db.query(query, params);
        res.json(pets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get a single pet's details (Merged version)
// @route   GET /api/pets/:id
// @access  Public
const getPetById = async (req, res) => {
    try {
        const { id } = req.params;

        // Step 1: Get pet details and join with shelter info
        const petQuery = `
            SELECT p.*, s.shelter_name as shelter_name, s.address as shelter_address, s.email as shelter_email
            FROM pets p
            JOIN Shelters s ON p.shelter_id = s.shelter_id
            WHERE p.pet_id = ?
        `;
        const [petRows] = await db.query(petQuery, [id]);

        if (petRows.length === 0) {
            return res.status(404).json({ message: 'Pet not found.' });
        }
        const pet = petRows[0];

        // Step 2: Get all vaccines for that pet
        const [vaccineRows] = await db.query('SELECT vaccine_name, date_given FROM vaccinations WHERE pet_id = ? ORDER BY date_given DESC', [id]);
        
        // Step 3: Combine into a single response
        const responsePayload = {
            ...pet,
            vaccines: vaccineRows 
        };

        res.status(200).json(responsePayload);
    } catch (error) {
        console.error('Error fetching pet details:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new pet
// @route   POST /api/pets
// @access  Private (Shelter)
const addPet = async (req, res) => {
    const { name, species, breed, age, gender, description, image_url } = req.body;
    const shelter_id = req.shelter.id;

    try {
        const newPet = { shelter_id, name, species, breed, age, gender, description, image_url };
        const [result] = await db.query('INSERT INTO pets SET ?', newPet);
        res.status(201).json({ id: result.insertId, ...newPet });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a pet's details (Merged version)
// @route   PUT /api/pets/:id
// @access  Private (Shelter)
const updatePet = async (req, res) => {
    const { name, species, breed, age, gender, description, image_url, adoption_status, is_neutered } = req.body;
    const petId = req.params.id;
    const shelterId = req.shelter.id;

    try {
        const [pets] = await db.query('SELECT * FROM pets WHERE pet_id = ? AND shelter_id = ?', [petId, shelterId]);
        if (pets.length === 0) {
            return res.status(401).json({ msg: 'Not authorized to edit this pet' });
        }

        const neuteredStatus = is_neutered ? 1 : 0;
        const updatedFields = { name, species, breed, age, gender, description, image_url, adoption_status, is_neutered: neuteredStatus };
        
        await db.query('UPDATE pets SET ? WHERE pet_id = ?', [updatedFields, petId]);
        res.json({ msg: 'Pet details updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private (Shelter)
const deletePet = async (req, res) => {
    const petId = req.params.id;
    const shelterId = req.shelter.id;

    try {
        const [pets] = await db.query('SELECT * FROM pets WHERE pet_id = ? AND shelter_id = ?', [petId, shelterId]);
        if (pets.length === 0) {
            return res.status(401).json({ msg: 'Not authorized to delete this pet' });
        }

        await db.query('DELETE FROM pets WHERE pet_id = ?', [petId]);
        res.json({ msg: 'Pet removed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add a vaccine for a specific pet
// @route   POST /api/pets/:id/vaccines
// @access  Private (Shelter)
const addVaccineForPet = async (req, res) => {
    const { id } = req.params;
    const { vaccine_name, date_given } = req.body;

    try {
        if (!vaccine_name || !date_given) {
            return res.status(400).json({ message: 'Vaccine name and date are required.' });
        }
        const query = 'INSERT INTO vaccinations (pet_id, vaccine_name, date_given) VALUES (?, ?, ?)';
        await db.query(query, [id, vaccine_name, date_given]);
        res.status(201).json({ message: 'Vaccine added successfully.' });
    } catch (error) {
        console.error('Error adding vaccine:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// This single export block ensures all functions are available to your route files.
module.exports = {
    getAllPets,
    getPetById,
    addPet,
    updatePet,
    deletePet,
    addVaccineForPet
};