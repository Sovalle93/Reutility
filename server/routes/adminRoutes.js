const express = require('express');
const router = express.Router();
const { protegerRuta, verificarRol } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { validateAdminCreateUser } = require('../schemas/userSchema');
const { hashPassword } = require('../utils/auth');
const pool = require('../config/db');

router.get('/admin/usuarios', protegerRuta, verificarRol(['admin']), async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT u.id, u.email, u.nombre, u.rol, u.municipio_id, m.nombre as municipio_nombre
            FROM usuarios u
            LEFT JOIN municipios m ON u.municipio_id = m.id
            ORDER BY u.id
        `);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

router.post('/admin/usuarios', protegerRuta, verificarRol(['admin']), validate(validateAdminCreateUser), async (req, res, next) => {
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
        next(error);
    }
});

router.put('/admin/usuarios/:id', protegerRuta, verificarRol(['admin']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rol, municipio_id } = req.body;

        await pool.query(
            'UPDATE usuarios SET rol = $1, municipio_id = $2 WHERE id = $3',
            [rol, municipio_id || null, id]
        );

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

router.delete('/admin/usuarios/:id', protegerRuta, verificarRol(['admin']), async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await pool.query('SELECT rol FROM usuarios WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (user.rows[0].rol === 'admin') {
            return res.status(400).json({ error: 'No se puede eliminar un administrador' });
        }

        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
