const db = require('../config/db');

// @desc    Get all available pets (Public)
// @route   GET /api/pets
exports.getAllPets = async (req, res) => {
  try {
    const [pets] = await db.query('SELECT * FROM pets WHERE adoption_status = "Available"');
    res.json(pets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add a new pet (Protected)
// @route   POST /api/pets
exports.addPet = async (req, res) => {
  // Get pet details from the request body
  const { name, species, breed, age, gender, description, image_url } = req.body;
  // Get the shelter's ID from the token (added by authMiddleware)
  const shelter_id = req.shelter.id;

  try {
    const newPet = {
      shelter_id,
      name,
      species,
      breed,
      age,
      gender,
      description,
      image_url
    };

    const [result] = await db.query('INSERT INTO pets SET ?', newPet);
    res.json({ id: result.insertId, ...newPet });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a pet (Protected)
// @route   PUT /api/pets/:id
exports.updatePet = async (req, res) => {
  const { name, species, breed, age, gender, description, image_url, adoption_status } = req.body;
  const petId = req.params.id;
  const shelterId = req.shelter.id;

  try {
    // Security Check: Make sure the pet belongs to the logged-in shelter
    const [pets] = await db.query('SELECT * FROM pets WHERE pet_id = ? AND shelter_id = ?', [petId, shelterId]);

    if (pets.length === 0) {
      return res.status(401).json({ msg: 'Not authorized to edit this pet' });
    }

    // If authorized, proceed with the update
    const updatedFields = { name, species, breed, age, gender, description, image_url, adoption_status };
    await db.query('UPDATE pets SET ? WHERE pet_id = ?', [updatedFields, petId]);

    res.json({ msg: 'Pet details updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a pet (Protected)
// @route   DELETE /api/pets/:id
exports.deletePet = async (req, res) => {
  const petId = req.params.id;
  const shelterId = req.shelter.id;

  try {
    // Security Check: Make sure the pet belongs to the logged-in shelter
    const [pets] = await db.query('SELECT * FROM pets WHERE pet_id = ? AND shelter_id = ?', [petId, shelterId]);

    if (pets.length === 0) {
      return res.status(401).json({ msg: 'Not authorized to delete this pet' });
    }

    // If authorized, proceed with deletion
    await db.query('DELETE FROM pets WHERE pet_id = ?', [petId]);
    
    res.json({ msg: 'Pet removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};