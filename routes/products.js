const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.pageSize || 10);
    let query = "SELECT * FROM products WHERE 1 = 1";
    let queryParams = [];

    if (req.query.q && req.query.q.trim() !== "") {
      const searchQuery = req.query.q.trim();
      query += " AND (name ILIKE $1 OR description ILIKE $1)";
      queryParams.push(`%${searchQuery}%`);
    }

    if (req.query.minPrice) {
      const minPrice = parseFloat(req.query.minPrice);
      query += " AND price >= $" + (queryParams.length + 1);
      queryParams.push(minPrice);
    }

    if (req.query.maxPrice) {
      const maxPrice = parseFloat(req.query.maxPrice);
      query += " AND price <= $" + (queryParams.length + 1);
      queryParams.push(maxPrice);
    }

    const countResult = await pool.query("SELECT COUNT(*) FROM products WHERE 1 = 1");
    const totalCount = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalCount / pageSize);
    const offset = (page - 1) * pageSize;

    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(pageSize, offset);

  

    const result = await pool.query(query, queryParams);
    const products = result.rows;

    res.json({ products, pageSize, page, totalPages });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
