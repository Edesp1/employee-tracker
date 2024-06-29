const mysql = require('mysql');
require('dotenv').config();

// Create a MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10, // adjust as needed
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD, // use dotenv for password security
    database: 'employees_DB',
    port: 3306
});

// Export the pool to be used in other modules
module.exports = pool;