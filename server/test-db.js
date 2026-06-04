const pool = require('./config/db');

async function testConnection() {
    try {
        const result = await pool.query('SELECT * FROM plazas');
        console.log('Conexión exitosa');
        console.log('Plazas:', result.rows);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testConnection();