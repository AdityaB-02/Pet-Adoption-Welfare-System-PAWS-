import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './css/AddPetPage.css'; // Assuming you'll reuse the same CSS

const EditPetPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Main form state for general pet details
    const [formData, setFormData] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        gender: 'Male',
        description: '',
        image_url: '',
        adoption_status: 'Available',
        is_neutered: false, // <-- Added new field with a default
        vaccines: [] // <-- Added to hold vaccine data
    });

    // Separate state for the "Add Vaccine" form
    const [vaccineName, setVaccineName] = useState('');
    const [vaccineDate, setVaccineDate] = useState('');

    // Function to fetch all pet data, including vaccines
    const fetchPetData = async () => {
        if (id) {
            try {
                // This API call now fetches the pet AND its vaccines
                const response = await axios.get(`http://localhost:5000/api/pets/${id}`);
                setFormData({
                    ...response.data,
                    // Ensure vaccines is always an array
                    vaccines: response.data.vaccines || [] 
                });
            } catch (error) {
                console.error("Error fetching pet data:", error);
            }
        }
    };

   useEffect(() => {
        // Define the function INSIDE useEffect
        const fetchPetData = async () => {
            if (id) {
                try {
                    const response = await axios.get(`http://localhost:5000/api/pets/${id}`);
                    setFormData({
                        ...response.data,
                        vaccines: response.data.vaccines || [] 
                    });
                } catch (error) {
                    console.error("Error fetching pet data:", error);
                }
            }
        };

        // Call it immediately
        fetchPetData();
    }, [id]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // A separate handler for checkboxes is clearer
    const onCheckboxChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    const onMainSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            // The PUT request now also sends the is_neutered status
            await axios.put(`http://localhost:5000/api/pets/${id}`, formData, config);
            alert('Pet updated successfully!');
            navigate('/shelter/dashboard');
        } catch (err) {
            alert('Error updating pet: ' + (err.response?.data?.msg || 'Server Error'));
        }
    };

    // --- NEW: Handler for adding a vaccine ---
    const handleAddVaccine = async (e) => {
        e.preventDefault();
        if (!vaccineName || !vaccineDate) {
            return alert('Please provide both a vaccine name and a date.');
        }
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await axios.post(`http://localhost:5000/api/pets/${id}/vaccines`, {
                vaccine_name: vaccineName,
                date_given: vaccineDate
            }, config);
            
            alert('Vaccine added successfully!');
            // Clear the form and refresh all pet data to show the new vaccine
            setVaccineName('');
            setVaccineDate('');
            fetchPetData();
        } catch (error) {
            alert('Failed to add vaccine.');
            console.error(error);
        }
    };

    return (
        <div className="form-container">
            {/* --- Main Pet Details Form --- */}
            <form className="pet-form" onSubmit={onMainSubmit}>
                <h2>Edit Pet Details</h2>
                {/* All your existing form groups go here... */}
                <div className="form-group">
                    <label>Pet's Name</label>
                    <input type="text" name="name" value={formData.name} onChange={onChange} required />
                </div>
                 <div className="form-group">
                    <label>Species</label>
                    <input type="text" name="species" value={formData.species} onChange={onChange} required />
                 </div>
                <div className="form-group">
                <div className="form-group">
                    <label>Breed</label>
                    <input type="text" name="breed" value={formData.breed} onChange={onChange} />
                </div>
                <div className="form-group">
                    <label>Age (years)</label>
                    <input type="number" name="age" value={formData.age} onChange={onChange} required />
                </div>
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={onChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={onChange} required></textarea>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="text" name="image_url" value={formData.image_url} onChange={onChange} />
        </div>
        <div className="form-group">
          <label>Adoption Status</label>
          <select name="adoption_status" value={formData.adoption_status} onChange={onChange}>
            <option value="Available">Available</option>
            <option value="Pending">Pending</option>
            <option value="Adopted">Adopted</option>
          </select>
        </div>


                {/* --- NEW: Checkbox for Neutered Status --- */}
                <div className="form-group form-group-checkbox">
                    <label htmlFor="is_neutered">Neutered/Spayed</label>
                    <input
                        type="checkbox"
                        id="is_neutered"
                        name="is_neutered"
                        checked={formData.is_neutered || false}
                        onChange={onCheckboxChange}
                    />
                </div>
                
                <button type="submit">Update Pet Details</button>
            </form>

            {/* --- NEW: Vaccine Management Section --- */}
            <div className="vaccine-section">
                <h2>Vaccination Record</h2>
                <div className="vaccine-list">
                    {formData.vaccines.length > 0 ? (
                        <ul>
                            {formData.vaccines.map((vaccine, index) => (
                                <li key={index}>
                                    <strong>{vaccine.vaccine_name}</strong> - {new Date(vaccine.date_given).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No vaccination records yet.</p>
                    )}
                </div>

                <form className="vaccine-form" onSubmit={handleAddVaccine}>
                    <h3>Add a Vaccine</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Vaccine Name"
                            value={vaccineName}
                            onChange={(e) => setVaccineName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="date"
                            value={vaccineDate}
                            onChange={(e) => setVaccineDate(e.target.value)}
                        />
                    </div>
                    <button type="submit">Add Vaccine</button>
                </form>
            </div>
        </div>
    );
};

export default EditPetPage;