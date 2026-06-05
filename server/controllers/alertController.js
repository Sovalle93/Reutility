const db = require('../config/db');

exports.getAlertas = async (req, res) => {
    try {
        const { status } = req.query;
        let query = `
            SELECT a.id, a.titulo, a.descripcion, a.categoria, a.estado, 
                   a.foto_url as imagen_url, a.notas_actualizacion as notas, a.usuario_id, a.created_at,
                   u.nombre as usuario_nombre
            FROM alertas a
            JOIN usuarios u ON a.usuario_id = u.id
            ORDER BY a.created_at DESC
        `;

        if (status) {
            query = `
                SELECT a.id, a.titulo, a.descripcion, a.categoria, a.estado, 
                       a.foto_url as imagen_url, a.notas_actualizacion as notas, a.usuario_id, a.created_at,
                       u.nombre as usuario_nombre
                FROM alertas a
                JOIN usuarios u ON a.usuario_id = u.id
                WHERE a.estado = $1
                ORDER BY a.created_at DESC
            `;
        }

        const result = status
            ? await db.query(query, [status])
            : await db.query(query);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener alertas:', error);
        res.status(500).json({ error: 'Error al obtener alertas' });
    }
};

exports.getAlertaById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT a.id, a.titulo, a.descripcion, a.categoria, a.estado, 
                   a.foto_url as imagen_url, a.notas_actualizacion as notas, a.usuario_id, a.created_at,
                   u.nombre as usuario_nombre
            FROM alertas a
            JOIN usuarios u ON a.usuario_id = u.id
            WHERE a.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alerta no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener alerta:', error);
        res.status(500).json({ error: 'Error al obtener alerta' });
    }
};

exports.createAlerta = async (req, res) => {
    try {
        const { titulo, descripcion, categoria } = req.body;
        const usuarioId = req.user.id;
        const imagenUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!titulo || !descripcion || !categoria) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
        }

        if (!imagenUrl) {
            return res.status(400).json({ error: 'La imagen es requerida' });
        }

        const result = await db.query(`
            INSERT INTO alertas (titulo, descripcion, categoria, foto_url, usuario_id, estado)
            VALUES ($1, $2, $3, $4, $5, 'pendiente')
            RETURNING *
        `, [titulo, descripcion, categoria, imagenUrl, usuarioId]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear alerta:', error);
        res.status(500).json({ error: 'Error al crear alerta' });
    }
};

exports.updateAlertaStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notas } = req.body;
        const usuarioId = req.user.id;

        // Validar que sea municipal worker
        const userResult = await db.query(
            'SELECT rol FROM usuarios WHERE id = $1',
            [usuarioId]
        );

        if (userResult.rows.length === 0 || !['municipal_worker', 'admin'].includes(userResult.rows[0].rol)) {
            return res.status(403).json({ error: 'No tienes permisos para actualizar alertas' });
        }

        const result = await db.query(`
            UPDATE alertas
            SET estado = $1, notas_actualizacion = $2, updated_at = NOW()
            WHERE id = $3
            RETURNING *
        `, [status, notas || null, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Alerta no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar alerta:', error);
        res.status(500).json({ error: 'Error al actualizar alerta' });
    }
};

exports.getMisAlertas = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const result = await db.query(`
            SELECT a.id, a.titulo, a.descripcion, a.categoria, a.estado, 
                   a.foto_url as imagen_url, a.notas_actualizacion as notas, a.usuario_id, a.created_at,
                   u.nombre as usuario_nombre
            FROM alertas a
            JOIN usuarios u ON a.usuario_id = u.id
            WHERE a.usuario_id = $1
            ORDER BY a.created_at DESC
        `, [usuarioId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener mis alertas:', error);
        res.status(500).json({ error: 'Error al obtener mis alertas' });
    }
};