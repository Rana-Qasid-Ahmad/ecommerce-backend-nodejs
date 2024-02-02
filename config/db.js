// index.js

const { Pool } = require("pg");

// Create a new pool instance with your PostgreSQL connection configuration
const pool = new Pool({
  user:process.env.db_user,
  host:process.env.db_host,
  database:process.env.db_database,
  password:process.env.db_password,
  port:process.env.db_port,
  ssl: {
    rejectUnauthorized: false,
  },
});
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to database");
  release(); // Release the client back to the pool
});
// Export the pool instance for use in other modules
module.exports = pool;
