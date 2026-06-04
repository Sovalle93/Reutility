const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Obtener todas las plazas
app.get('/api/plazas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM plazas ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener una plaza específica
app.get('/api/plazas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM plazas WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Plaza no encontrada' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener reviews de una plaza
app.get('/api/plazas/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM reviews WHERE plaza_id = $1 ORDER BY created_at DESC',
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar review a una plaza
app.post('/api/plazas/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comentario, usuario_nombre } = req.body;
        
        const result = await pool.query(
            'INSERT INTO reviews (plaza_id, usuario_nombre, rating, comentario) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, usuario_nombre || 'Anónimo', rating, comentario]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});