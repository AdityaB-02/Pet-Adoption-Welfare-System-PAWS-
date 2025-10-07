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
        const sql = "INSERT INTO messages (sender_id, recipient_id, pet_id, content, is_shelter) VALUES (?, ?, ?, ?, ?)";
        await db.query(sql, [sender_id, recipient_id, pet_id, content, 0]); // 0 = user
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

/**
 * @route   GET api/messages/conversation/:userId/:petId
 * @desc    Get conversation between shelter and a specific user about a specific pet
 * @access  Private (Shelters Only)
 */
router.get('/conversation/:userId/:petId', shelterAuth, async (req, res) => {
    const shelter_id = req.shelter.id;
    const user_id = req.params.userId;
    const pet_id = req.params.petId;

    try {
        const sql = `
            SELECT 
                m.*,
                u.full_name AS sender_name,
                s.shelter_name AS shelter_name
            FROM messages m
            LEFT JOIN users u ON m.sender_id = u.user_id
            LEFT JOIN shelters s ON m.sender_id = s.shelter_id
            WHERE ((m.sender_id = ? AND m.recipient_id = ?)
               OR (m.sender_id = ? AND m.recipient_id = ?))
               AND (m.pet_id = ? OR m.pet_id IS NULL)
            ORDER BY m.created_at ASC
        `;
        const [messages] = await db.query(sql, [user_id, shelter_id, shelter_id, user_id, pet_id]);
        res.json(messages);
    } catch (err) {
        console.error("!!! DATABASE ERROR fetching conversation:", err);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   POST api/messages/reply
 * @desc    A SHELTER replies to a user
 * @access  Private (Shelters Only)
 */
router.post('/reply', shelterAuth, async (req, res) => {
    console.log('=== SHELTER REPLY REQUEST ===');
    console.log('req.shelter:', req.shelter);
    console.log('req.body:', req.body);
    
    const sender_id = req.shelter.id;
    const { recipient_id, pet_id, content } = req.body;

    if (!sender_id) {
        console.error('!!! No shelter ID found in token');
        return res.status(401).json({ msg: 'Shelter authentication failed' });
    }

    if (!recipient_id || !content) {
        console.error('!!! Missing recipient_id or content');
        return res.status(400).json({ msg: 'Recipient and content are required.' });
    }

    try {
        const sql = "INSERT INTO messages (sender_id, recipient_id, pet_id, content, is_shelter) VALUES (?, ?, ?, ?, ?)";
        console.log('Executing SQL with:', [sender_id, recipient_id, pet_id, content, 1]);
        await db.query(sql, [sender_id, recipient_id, pet_id, content, 1]); // 1 = shelter
        console.log('Reply sent successfully');
        res.status(201).json({ msg: 'Reply sent successfully' });
    } catch (err) {
        console.error("!!! ERROR sending reply:", err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

/**
 * @route   GET api/messages/user-conversation/:shelterId/:petId
 * @desc    Get conversation between user and a specific shelter about a specific pet
 * @access  Private (Users Only)
 */
router.get('/user-conversation/:shelterId/:petId', userAuth, async (req, res) => {
    const user_id = req.user.id;
    const shelter_id = req.params.shelterId;
    const pet_id = req.params.petId;

    try {
        const sql = `
            SELECT 
                m.*,
                u.full_name AS sender_name,
                s.shelter_name AS shelter_name
            FROM messages m
            LEFT JOIN users u ON m.sender_id = u.user_id
            LEFT JOIN shelters s ON m.sender_id = s.shelter_id
            WHERE ((m.sender_id = ? AND m.recipient_id = ?)
               OR (m.sender_id = ? AND m.recipient_id = ?))
               AND (m.pet_id = ? OR m.pet_id IS NULL)
            ORDER BY m.created_at ASC
        `;
        const [messages] = await db.query(sql, [user_id, shelter_id, shelter_id, user_id, pet_id]);
        res.json(messages);
    } catch (err) {
        console.error("!!! DATABASE ERROR fetching user conversation:", err);
        res.status(500).send('Server Error');
    }
});

/**
 * @route   GET api/messages/user-inbox
 * @desc    Get all conversations for a user
 * @access  Private (Users Only)
 */
router.get('/user-inbox', userAuth, async (req, res) => {
    const user_id = req.user.id;

    try {
        const sql = `
            SELECT 
                m.*,
                s.shelter_name,
                p.name AS pet_name,
                p.image_url AS pet_image_url,
                ? AS user_id
            FROM messages m
            LEFT JOIN shelters s ON (m.sender_id = s.shelter_id OR m.recipient_id = s.shelter_id)
            LEFT JOIN pets p ON m.pet_id = p.pet_id
            WHERE m.sender_id = ? OR m.recipient_id = ?
            ORDER BY m.created_at DESC
        `;
        const [messages] = await db.query(sql, [user_id, user_id, user_id]);
        res.json(messages);
    } catch (err) {
        console.error("!!! DATABASE ERROR fetching user inbox:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;