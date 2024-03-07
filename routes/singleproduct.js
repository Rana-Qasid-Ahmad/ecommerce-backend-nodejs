const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const jwt = require('jsonwebtoken');

// Route to open a product by its ID
router.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId; // Extracting product ID from request parameters
    console.log(productId);
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


// Route to update a product by its ID
router.put("/:productId", async (req, res) => {
  try {
    const token = req.headers.authorization; // Extract JWT token from the request headers

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Check if the user's role contains 'admin'
      if (!decoded || !decoded.role || !decoded.role.includes('admin')) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const productId = req.params.productId; // Extracting product ID from request parameters
      const { name, description, price, stock, image_url } = req.body; // Extracting fields from request body

      // Initialize arrays to hold the SET clauses and parameters for the SQL query
      let setClauses = [];
      let parameters = [];

      // Add SET clauses and parameters only for fields that are provided in the request body
      if (name) {
        setClauses.push(`name = $${parameters.length + 1}`);
        parameters.push(name);
      }
      if (description) {
        setClauses.push(`description = $${parameters.length + 1}`);
        parameters.push(description);
      }
      if (price) {
        setClauses.push(`price = $${parameters.length + 1}`);
        parameters.push(price);
      }
      if (stock) {
        setClauses.push(`stock = $${parameters.length + 1}`);
        parameters.push(stock);
      }
      if (image_url) {
        setClauses.push(`image_url = $${parameters.length + 1}`);
        parameters.push(image_url);
      }

      // Constructing the SQL query to update the product
      const query = `
        UPDATE products 
        SET ${setClauses.join(', ')}
        WHERE id = $${parameters.length + 1}
      `;

      // Add the productId parameter for the WHERE clause
      parameters.push(productId);

      // Executing the SQL query with the parameters
      const result = await pool.query(query, parameters);

      res.json({ message: "Product updated successfully" });
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
