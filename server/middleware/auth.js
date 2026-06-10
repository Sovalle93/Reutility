const { verifyToken } = require('../utils/auth');
const pool = require('../config/db');

const protegerRuta = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Token inválido o expirado.' });
        }

        const result = await pool.query(
            'SELECT id, email, nombre, rol, municipio_id, activo FROM usuarios WHERE id = $1',
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado.' });
        }

        const usuario = result.rows[0];
        if (!usuario.activo) {
            return res.status(401).json({ error: 'Usuario desactivado.' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.error('Error en autenticación:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({ error: 'No autorizado.' });
        }
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({ error: 'Permisos insuficientes.' });
        }
        next();
    };
};

module.exports = { protegerRuta, verificarRol };