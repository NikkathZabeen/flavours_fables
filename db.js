const mysql = require('mysql2/promise'); // Use the promise version of mysql2

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',  // Replace with your database host
    user: 'root',       // Your MySQL username
    password: 'NiksSQL@5353',  // Your MySQL password
    database: 'projectdb', // Your MySQL database name
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

// Export the pool
module.exports = pool; // You can directly export the promise-based pool
