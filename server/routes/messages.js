const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/messages
// @desc    Send a new message to a shelter
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    // This route is working correctly
    const sender_id = req.shelter.id; 
    const { recipient_id, pet_id, content } = req.body;

    if (!recipient_id || !content) {
        return res.status(400).json({ msg: 'Recipient and content are required.' });
    }

    try {
        const sql = "INSERT INTO messages (sender_id, recipient_id, pet_id, content) VALUES (?, ?, ?, ?)";
        await db.query(sql, [sender_id, recipient_id, pet_id, content]);
        res.status(201).json({ msg: 'Message sent successfully' });
    } catch (err) {
        console.error("!!! ERROR sending message:", err); 
        res.status(500).send('Server Error');
    }
});

// @route   GET api/messages/inbox
// @desc    Get all messages for the logged-in shelter
// @access  Private (for shelters)
router.get('/inbox', authMiddleware, async (req, res) => {
    const shelter_id = req.shelter.id;

    try {
        // --- THIS IS THE CORRECTED SQL QUERY ---
        // The fix is changing `p.id` back to `p.pet_id` to match your table structure.
        const sql = `
            SELECT 
                m.*, 
                u.full_name AS sender_name,
                u.email AS sender_email,
                u.phone_number AS sender_phone,
                p.name AS pet_name,
                p.image_url AS pet_image_url
            FROM messages m
            JOIN users u ON m.sender_id = u.user_id
            LEFT JOIN pets p ON m.pet_id = p.pet_id
            WHERE m.recipient_id = ?
            ORDER BY m.created_at DESC
        `;
        const [messages] = await db.query(sql, [shelter_id]);
        res.json(messages);
    } catch (err) {
        console.error("!!! DATABASE ERROR fetching inbox:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

