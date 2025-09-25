// In server/controllers/userController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to register a new user
exports.registerUser = async (req, res) => {
  const { email, password, full_name, address } = req.body;

  try {
    // 1. Check if user already exists
    let [user] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
    if (user.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Insert the new user into the database
    const newUser = { email, password_hash, full_name, address };
    const [result] = await db.query('INSERT INTO users SET ?', newUser);
    const userId = result.insertId;

    // 4. Create and return a JWT token
    const payload = { user: { id: userId } };
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
    res.status(500).send('Server error');
  }
};

// Function to log in a user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        let [userRows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userRows.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        const user = userRows[0];

        // 2. Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. Create and return a JWT token
        const payload = { user: { id: user.user_id } };
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