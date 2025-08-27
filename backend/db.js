
const { Pool } = require('pg');

// TODO: Reemplazar con tus credenciales de PostgreSQL
const pool = new Pool({
    user: 'nozomi.proxy.rlwy.net',
    host: 'localhost',
    database: 'railway',
    password: 'iMoANddwioanuFnLiGAzpZUsQCixGcJR',
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
