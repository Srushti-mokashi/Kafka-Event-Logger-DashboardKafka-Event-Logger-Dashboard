const mysql = require('mysql2');
require('dotenv').config();

// Create the connection pool to the database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'event_logger',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export the promise-based pool for easier async/await usage
module.exports = pool.promise();
