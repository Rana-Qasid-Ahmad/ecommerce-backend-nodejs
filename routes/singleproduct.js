const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Route to open a product by its ID
router.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId; // Extracting product ID from request parameters
    
    const query = "SELECT * FROM products WHERE id = $1";
    const result = await pool.query(query, [productId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = result.rows[0];
    res.json({ product });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
