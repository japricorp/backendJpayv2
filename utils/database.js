const mysql = require('mysql2');
const { promisify } = require('util');

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user:  process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const query = promisify(conn.query).bind(conn);

module.exports = { query, conn };