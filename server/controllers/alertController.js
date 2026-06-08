const db = require('../config/db');

exports.getAlertas = async (req, res) => {
    try {
        const { status } = req.query;
        let query = `
            SELECT a.id, a.titulo, a.descripcion, a.categoria, a.estado, 
                   a.foto_url as imagen_url, a.notas_actualizacion as notas, a.usuario_id, a.created_at,
                   u.nombre as usuario_nombre, p.municipio_id, m.nombre as municipio_nombre
            FROM alertas a
            JOIN usuarios u ON a.usuario_id = u.id
            LEFT JOIN plazas p ON a.plaza_id = p.id
            LEFT JOIN municipios m ON p.municipio_id = m.id
        `;
        let params = [];

        if (status) {
            query += ' WHERE a.estado = $1 ';
            params.push(status);
        }

        query += ' ORDER BY a.created_at DESC';

        const result = await db.query(query, params);
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
                   u.nombre as usuario_nombre, p.municipio_id, m.nombre as municipio_nombre
            FROM alertas a
            JOIN usuarios u ON a.usuario_id = u.id
            LEFT JOIN plazas p ON a.plaza_id = p.id
            LEFT JOIN municipios m ON p.municipio_id = m.id
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
        const usuarioId = req.usuario.id;
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
        const usuarioId = req.usuario.id;
        const userRol = req.usuario.rol;
        const userMunicipioId = req.usuario.municipio_id;

        // Get alert with plaza info
        const alertaResult = await db.query(`
            SELECT a.*, p.municipio_id
            FROM alertas a
            LEFT JOIN plazas p ON a.plaza_id = p.id
            WHERE a.id = $1
        `, [id]);

        if (alertaResult.rows.length === 0) {
            return res.status(404).json({ error: 'Alerta no encontrada' });
        }

        const alerta = alertaResult.rows[0];

        // Validar permisos: must be municipal_worker or admin
        if (!['municipal_worker', 'admin'].includes(userRol)) {
            return res.status(403).json({ error: 'No tienes permisos para actualizar alertas' });
        }

        // If fiscalizador or municipal_worker, check municipio access
        if (req.municipioContext && req.municipioContext.shouldFilterByMunicipio()) {
            if (alerta.municipio_id && !req.municipioContext.canAccessMunicipio(alerta.municipio_id)) {
                return res.status(403).json({ error: 'No tienes acceso a esta alerta' });
            }
        }

        const result = await db.query(`
            UPDATE alertas
            SET estado = $1, notas_actualizacion = $2, updated_at = NOW()
            WHERE id = $3
            RETURNING *
        `, [status, notas || null, id]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar alerta:', error);
        res.status(500).json({ error: 'Error al actualizar alerta' });
    }
};

exports.getMisAlertas = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const result = await db.query(`
            SELECT a.id, a.titulo, a.descripcion, a.categoria, a.estado, 
                   a.foto_url as imagen_url, a.notas_actualizacion as notas, a.usuario_id, a.created_at,
                   u.nombre as usuario_nombre, p.municipio_id, m.nombre as municipio_nombre
            FROM alertas a
            JOIN usuarios u ON a.usuario_id = u.id
            LEFT JOIN plazas p ON a.plaza_id = p.id
            LEFT JOIN municipios m ON p.municipio_id = m.id
            WHERE a.usuario_id = $1
            ORDER BY a.created_at DESC
        `, [usuarioId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener mis alertas:', error);
        res.status(500).json({ error: 'Error al obtener mis alertas' });
    }
};