// routes/register.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Import the database connection pool

router.post('/', async (req, res) => {
  const { username, email, password,role } = req.body;

  // Check if username, email, and password are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert the user into the database with the hashed password
    const query = 'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [username, email, hashedPassword, role]);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
