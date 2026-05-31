const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,         
    host: process.env.DB_HOST,        
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,          
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