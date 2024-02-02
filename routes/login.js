// routes/login.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const pool = require("../config/db"); // Import the database connection pool

const secretKey = process.env.JWT_SECRET;

// Validate login input
const validateLoginInput = [
  body("username").notEmpty().trim().escape(),
  body("password").notEmpty().trim().escape(),
];

router.post("/", validateLoginInput, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Retrieve user from the database
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    // Compare hashed passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.user_id,
          role: user.role,
          username: user.username,
          email: user.email,
        },
        secretKey,
        { expiresIn: "1h" } // Token expires in 1 hour
      );
      // Return JWT token and user details
      res.json({
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
        // Add more user details as needed
      });
    } else {
      // Invalid credentials
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
