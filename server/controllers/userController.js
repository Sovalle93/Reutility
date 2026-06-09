const pool = require('../config/db');

// ===== MIS REVIEWS =====
const getMisReviews = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        const result = await pool.query(
            `SELECT r.*, p.nombre as plaza_nombre, p.id as plaza_id
             FROM reviews r
             JOIN plazas p ON r.plaza_id = p.id
             WHERE r.usuario_id = $1
             ORDER BY r.created_at DESC`,
            [usuario_id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error en getMisReviews:', error);
        res.status(500).json({ error: error.message });
    }
};

// ===== USER REVIEW FOR A PLAZA =====
const getUserReview = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario_id = req.usuario.id;
        const result = await pool.query(
            'SELECT * FROM reviews WHERE plaza_id = $1 AND usuario_id = $2',
            [id, usuario_id]
        );
        res.json(result.rows[0] || null);
    } catch (error) {
        console.error('Error en getUserReview:', error);
        res.status(500).json({ error: error.message });
    }
};

// ===== UPDATE REVIEW =====
const updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comentario } = req.body;
        const usuario_id = req.usuario.id;

        const reviewExistente = await pool.query(
            'SELECT * FROM reviews WHERE id = $1 AND usuario_id = $2',
            [reviewId, usuario_id]
        );

        if (reviewExistente.rows.length === 0) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const result = await pool.query(
            'UPDATE reviews SET rating = $1, comentario = $2 WHERE id = $3 RETURNING *',
            [rating, comentario, reviewId]
        );

        const plazaId = reviewExistente.rows[0].plaza_id;
        await pool.query(
            `UPDATE plazas 
             SET rating_promedio = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE plaza_id = $1)
             WHERE id = $1`,
            [plazaId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error en updateReview:', error);
        res.status(500).json({ error: error.message });
    }
};

// ===== DELETE REVIEW =====
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const usuario_id = req.usuario.id;

        const reviewExistente = await pool.query(
            'SELECT * FROM reviews WHERE id = $1 AND usuario_id = $2',
            [reviewId, usuario_id]
        );

        if (reviewExistente.rows.length === 0) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        const plazaId = reviewExistente.rows[0].plaza_id;

        await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);

        await pool.query(
            `UPDATE plazas 
             SET rating_promedio = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE plaza_id = $1),
                 total_reviews = (SELECT COUNT(*) FROM reviews WHERE plaza_id = $1)
             WHERE id = $1`,
            [plazaId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Error en deleteReview:', error);
        res.status(500).json({ error: error.message });
    }
};

// ===== MIS ALERTAS =====
const getMisAlertas = async (req, res) => {
    try {
        const usuario_id = req.usuario.id;
        
        const result = await pool.query(`
            SELECT a.*, p.nombre as plaza_nombre, p.municipio_id,
                   m.nombre as municipio_nombre
            FROM alertas a
            JOIN plazas p ON a.plaza_id = p.id
            LEFT JOIN municipios m ON p.municipio_id = m.id
            WHERE a.usuario_id = $1
            ORDER BY a.created_at DESC
        `, [usuario_id]);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error en getMisAlertas:', error);
        res.status(500).json({ error: error.message });
    }
};

// ===== EXPORTAR AL FINAL (después de todas las funciones) =====
module.exports = { 
    getMisReviews, 
    getUserReview, 
    updateReview, 
    deleteReview, 
    getMisAlertas 
};