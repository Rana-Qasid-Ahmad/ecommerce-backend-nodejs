const jwt = require('jsonwebtoken');
const express = require("express");
const router = express.Router();
// Middleware function to authenticate the user
function authenticateToken(req, res, next) {
    // Gather the JWT token from the request headers, cookies, or query parameters
    const token = req.headers['authorization'];

    if (!token) {
        return res.json({ message: 'Token Not Provided' });
        // Unauthorized if no token is provided
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.json({ message: 'Invalid Token' });
            // Forbidden if token is invalid
        }
        // If the token is valid, attach the user object to the request for further processing
        req.user = user;
        next(); // Pass control to the next middleware
    });
}

// Route to handle user data retrieval
router.get('/user', authenticateToken, (req, res) => {
    // The user data can now be accessed from the req.user object
    res.json(req.user);
});

module.exports = router;
