const mysql = require('mysql2');
require('dotenv').config(); // This loads the variables from .env

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export a promise-wrapped version of the pool
module.exports = pool.promise();