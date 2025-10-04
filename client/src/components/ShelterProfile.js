import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ShelterProfile.css'; // We will create this CSS file

const ShelterProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    shelter_name: '',
    address: '',
    capacity: ''
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('http://localhost:5000/api/shelters/me', config);
      setProfile(res.data);
      setFormData({
        shelter_name: res.data.shelter_name,
        address: res.data.address,
        capacity: res.data.capacity
      });
    } catch (error) {
      console.error("Could not fetch profile", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      await axios.put('http://localhost:5000/api/shelters/me', formData, config);
      alert('Profile updated!');
      fetchProfile(); // Re-fetch the updated profile data
      setIsEditing(false); // Switch back to view mode
    } catch (error) {
      console.error("Could not update profile", error);
      alert('Failed to update profile.');
    }
  };

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="shelter-profile">
      <h2>Shelter Profile</h2>
      {isEditing ? (
        // --- EDIT MODE ---
        <form onSubmit={handleSave} className="profile-form">
          <div className="form-group">
            <label>Shelter Name</label>
            <input type="text" name="shelter_name" value={formData.shelter_name} onChange={onChange} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea name="address" value={formData.address} onChange={onChange}></textarea>
          </div>
          <div className="form-group">
            <label>Capacity</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={onChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">Save Changes</button>
            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </form>
      ) : (
        // --- VIEW MODE ---
        <div className="profile-view">
          <p><strong>Shelter Name:</strong> {profile.shelter_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Address:</strong> {profile.address}</p>
          <p><strong>Capacity:</strong> {profile.capacity} animals</p>
          <button onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default ShelterProfile;