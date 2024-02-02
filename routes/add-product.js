// routes/products.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Please Login Frist" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = decoded;
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not a admin" });
    }
    next();
  });
}

// POST endpoint to insert a new product
router.post("/add-product", authenticateToken, async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl } = req.body;

    // Ensure required fields are provided
    if (!name || !price || !stock || !description || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Name, price, and stock are required fields" });
    }

    // Insert the product into the database
    const queryText =
      "INSERT INTO products (name, description, price, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [name, description, price, stock, imageUrl];

    const result = await pool.query(queryText, values);
    const insertedProduct = result.rows[0];

    res
      .status(201)
      .json({
        message: "Product inserted successfully",
        product: insertedProduct,
      });
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
