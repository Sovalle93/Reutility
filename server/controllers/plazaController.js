const pool = require('../config/db');

const getPlazas = async (req, res) => {
    try {
        const { municipio_id } = req.query;
        let query = `SELECT p.*, m.nombre as municipio_nombre FROM plazas p 
                    LEFT JOIN municipios m ON p.municipio_id = m.id`;
        let params = [];

        if (municipio_id) {
            query += ' WHERE p.municipio_id = $1 ORDER BY p.id';
            params = [municipio_id];
        } else {
            query += ' ORDER BY p.id';
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPlazaById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Primero obtener la plaza
        const plazaResult = await pool.query('SELECT * FROM plazas WHERE id = $1', [id]);
        
        if (plazaResult.rows.length === 0) {
            return res.status(404).json({ error: 'Plaza no encontrada' });
        }
        
        const plaza = plazaResult.rows[0];
        
        // Luego obtener el nombre del municipio si tiene municipio_id
        if (plaza.municipio_id) {
            const municipioResult = await pool.query('SELECT nombre FROM municipios WHERE id = $1', [plaza.municipio_id]);
            if (municipioResult.rows.length > 0) {
                plaza.municipio_nombre = municipioResult.rows[0].nombre;
            }
        }
        
        res.json(plaza);
    } catch (error) {
        console.error('Error en getPlazaById:', error);
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


const getRanking = async (req, res) => {
    try {
        const { municipio_id, limit = 10 } = req.query;
        let query = `
            SELECT 
                p.id, 
                p.nombre, 
                p.municipio_id,
                m.nombre as municipio_nombre,
                p.rating_promedio, 
                p.total_reviews,
                p.descripcion,
                CASE 
                    WHEN p.total_reviews = 0 THEN 0 
                    ELSE ROUND(p.rating_promedio, 2)
                END as rating_display
            FROM plazas p
            LEFT JOIN municipios m ON p.municipio_id = m.id
        `;
        
        let params = [];
        
        if (municipio_id) {
            query += ` WHERE p.municipio_id = $1`;
            params.push(municipio_id);
        }
        
        query += ` ORDER BY p.rating_promedio DESC, p.total_reviews DESC LIMIT $${params.length + 1}`;
        params.push(limit);
        
        const result = await pool.query(query, params);
        
        // Calcular posición para cada plaza
        const ranking = result.rows.map((plaza, index) => ({
            ...plaza,
            posicion: index + 1,
            medalla: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null
        }));
        
        // Obtener estadísticas generales del municipio
        let statsQuery = `
            SELECT 
                COUNT(*) as total_plazas,
                ROUND(AVG(rating_promedio), 2) as promedio_general
            FROM plazas
        `;
        
        if (municipio_id) {
            statsQuery += ` WHERE municipio_id = $1`;
            const statsResult = await pool.query(statsQuery, [municipio_id]);
            res.json({
                ranking,
                estadisticas: statsResult.rows[0],
                municipio_id: municipio_id || null
            });
        } else {
            const statsResult = await pool.query(statsQuery);
            res.json({
                ranking,
                estadisticas: statsResult.rows[0],
                municipio_id: null
            });
        }
        
    } catch (error) {
        console.error('Error en getRanking:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getPlazas, getPlazaById, getReviewsByPlaza, createReview, getRanking };