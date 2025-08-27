
const { Pool } = require('pg');

// TODO: Reemplazar con tus credenciales de PostgreSQL
const pool = new Pool({
    user: 'postgres', // Tu usuario de PostgreSQL
    host: 'localhost',
    database: 'docutrack', // El nombre de tu base de datos
    password: 'tu_contraseña', // Tu contraseña de PostgreSQL
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
