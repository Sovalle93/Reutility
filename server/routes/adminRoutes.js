const express = require('express');
const router = express.Router();
const { protegerRuta, verificarRol } = require('../middleware/auth');
const { hashPassword } = require('../utils/auth');
const pool = require('../config/db');

// Obtener todos los usuarios (solo admin)
router.get('/admin/usuarios', protegerRuta, verificarRol(['admin']), async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.id, u.email, u.nombre, u.rol, u.municipio_id, m.nombre as municipio_nombre
            FROM usuarios u
            LEFT JOIN municipios m ON u.municipio_id = m.id
            ORDER BY u.id
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear usuario (solo admin)
router.post('/admin/usuarios', protegerRuta, verificarRol(['admin']), async (req, res) => {
    try {
        const { email, nombre, password, rol, municipio_id } = req.body;
        
        const existing = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Email ya existe' });
        }
        
        const passwordHash = await hashPassword(password);
        
        const result = await pool.query(`
            INSERT INTO usuarios (email, nombre, password_hash, rol, municipio_id, provider)
            VALUES ($1, $2, $3, $4, $5, 'email')
            RETURNING id, email, nombre, rol
        `, [email, nombre, passwordHash, rol, municipio_id || null]);
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar rol de usuario (solo admin)
router.put('/admin/usuarios/:id', protegerRuta, verificarRol(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const { rol, municipio_id } = req.body;
        
        await pool.query(`
            UPDATE usuarios SET rol = $1, municipio_id = $2 WHERE id = $3
        `, [rol, municipio_id || null, id]);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;