const mysql = require('mysql2/promise');

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root', // Change to your MySQL username
  password: '', // Change to your MySQL password
  database: 'hospital_app', // Matches schema.sql
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = conn;