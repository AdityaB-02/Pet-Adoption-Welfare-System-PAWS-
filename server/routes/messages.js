const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Import BOTH middleware files for clarity
const shelterAuth = require('../middleware/authMiddleware');
const userAuth = require('../middleware/userAuthMiddleware');

/**
 * @route   POST api/messages
 * @desc    A USER sends a message to a shelter
 * @access  Private (Users Only)
 */
router.post('/', userAuth, async (req, res) => { // <-- Uses USER's auth
    const sender_id = req.user.id; // <-- Gets sender ID from user token
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

/**
 * @route   GET api/messages/inbox
 * @desc    A SHELTER views their inbox
 * @access  Private (Shelters Only)
 */
router.get('/inbox', shelterAuth, async (req, res) => { // <-- Uses SHELTER's auth
    const shelter_id = req.shelter.id; // <-- Gets recipient ID from shelter token

    try {
        const sql = `
            SELECT 
                m.*, 
                u.full_name AS sender_name,
                u.email AS sender_email,
                u.phone_number as phone_number,
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