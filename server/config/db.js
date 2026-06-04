const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Pacha2023',
    database: 'reutility_dev'
});

module.exports = pool;