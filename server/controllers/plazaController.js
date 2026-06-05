const pool = require('../config/db');

const getPlazas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM plazas ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPlazaById = async (req, res) => {
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
};

const getReviewsByPlaza = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT r.*, u.nombre as usuario_nombre 
             FROM reviews r
             LEFT JOIN usuarios u ON r.usuario_id = u.id
             WHERE r.plaza_id = $1 
             ORDER BY r.created_at DESC`,
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comentario } = req.body;
        const usuario_id = req.usuario.id;

        const result = await pool.query(
            `INSERT INTO reviews (plaza_id, usuario_id, rating, comentario) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id, usuario_id, rating, comentario]
        );

        await pool.query(
            `UPDATE plazas 
             SET rating_promedio = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE plaza_id = $1),
                 total_reviews = (SELECT COUNT(*) FROM reviews WHERE plaza_id = $1)
             WHERE id = $1`,
            [id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getPlazas, getPlazaById, getReviewsByPlaza, createReview };