const pool = require('../config/db');

// ===== GET ALL ALERTAS =====
const getAlertas = async (req, res, next) => {
    try {
        const { status } = req.query;
        const { rol, municipio_id } = req.municipioContext || {};
        
        let query = `
            SELECT a.*, p.nombre as plaza_nombre, u.nombre as usuario_nombre
            FROM alertas a
            JOIN plazas p ON a.plaza_id = p.id
            JOIN usuarios u ON a.usuario_id = u.id
        `;
        
        let conditions = [];
        let params = [];
        
        if (rol === 'fiscalizador' && municipio_id) {
            conditions.push(`p.municipio_id = $${params.length + 1}`);
            params.push(municipio_id);
        }
        
        if (status) {
            conditions.push(`a.estado = $${params.length + 1}`);
            params.push(status);
        }
        
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }
        
        query += ` ORDER BY a.created_at DESC`;
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

// ===== GET ALERTA BY ID =====
const getAlertaById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
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
        next(error);
    }
};

// ===== CREATE ALERTA =====
const createAlerta = async (req, res, next) => {
    try {
        const { titulo, descripcion, categoria, plaza_id } = req.body; // ✅ Ya validado
        const usuarioId = req.usuario.id;
        const imagenUrl = req.file ? `/uploads/${req.file.filename}` : null;

        // ✅ Solo queda lógica de negocio
        if (!imagenUrl) {
            return res.status(400).json({ error: 'La imagen es requerida' });
        }

        const result = await pool.query(`
            INSERT INTO alertas (titulo, descripcion, categoria, foto_url, usuario_id, plaza_id, estado)
            VALUES ($1, $2, $3, $4, $5, $6, 'pendiente')
            RETURNING *
        `, [titulo, descripcion, categoria, imagenUrl, usuarioId, plaza_id]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// ===== UPDATE ALERTA STATUS =====
const updateAlertaStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, notas } = req.body;
        const usuarioId = req.usuario.id;
        const userRol = req.usuario.rol;
        const userMunicipioId = req.usuario.municipio_id;

        const alertaResult = await pool.query(`
            SELECT a.*, p.municipio_id
            FROM alertas a
            LEFT JOIN plazas p ON a.plaza_id = p.id
            WHERE a.id = $1
        `, [id]);

        if (alertaResult.rows.length === 0) {
            return res.status(404).json({ error: 'Alerta no encontrada' });
        }

        const alerta = alertaResult.rows[0];

        // Solo municipal_worker o admin pueden actualizar
        if (!['municipal_worker', 'admin', 'fiscalizador'].includes(userRol)) {
            return res.status(403).json({ error: 'No tienes permisos para actualizar alertas' });
        }

        // Verificar municipio para fiscalizador/municipal_worker
        if (req.municipioContext && req.municipioContext.shouldFilterByMunicipio?.()) {
            if (alerta.municipio_id && !req.municipioContext.canAccessMunicipio(alerta.municipio_id)) {
                return res.status(403).json({ error: 'No tienes acceso a esta alerta' });
            }
        }

        const result = await pool.query(`
            UPDATE alertas
            SET estado = $1, notas_actualizacion = $2, updated_at = NOW(), actualizado_por = $3
            WHERE id = $4
            RETURNING *
        `, [status, notas || null, usuarioId, id]);

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// ===== GET MIS ALERTAS =====
const getMisAlertas = async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id;

        const result = await pool.query(`
            SELECT a.id, a.titulo, a.descripcion, a.categoria, a.estado, 
                   a.foto_url as imagen_url, a.notas_actualizacion as notas, a.usuario_id, a.created_at,
                   u.nombre as usuario_nombre, p.municipio_id, m.nombre as municipio_nombre,
                   p.nombre as plaza_nombre
            FROM alertas a
            JOIN usuarios u ON a.usuario_id = u.id
            LEFT JOIN plazas p ON a.plaza_id = p.id
            LEFT JOIN municipios m ON p.municipio_id = m.id
            WHERE a.usuario_id = $1
            ORDER BY a.created_at DESC
        `, [usuarioId]);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

// ===== EXPORTAR AL FINAL (todas las funciones) =====
module.exports = { 
    getAlertas, 
    getAlertaById, 
    createAlerta, 
    updateAlertaStatus, 
    getMisAlertas 
};