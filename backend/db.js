const { Pool } = require('pg');

// Conexión a la base de datos usando variables de entorno
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};