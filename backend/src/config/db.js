const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log("Successfully connected to PostgreSQL!");
    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
}

testConnection();

module.exports = pool;