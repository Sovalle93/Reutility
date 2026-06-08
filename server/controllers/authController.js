const pool = require('../config/db');
const { hashPassword, verifyPassword, generateToken } = require('../utils/auth');

const registrar = async (req, res) => {
    try {
        const { email, password, nombre } = req.body;

        const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const passwordHash = await hashPassword(password);
        const result = await pool.query(
            `INSERT INTO usuarios (email, password_hash, nombre, provider) 
             VALUES ($1, $2, $3, 'email') 
             RETURNING id, email, nombre, rol, municipio_id`,
            [email, passwordHash, nombre]
        );

        const usuario = result.rows[0];
        const token = generateToken(usuario);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, usuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            'SELECT id, email, nombre, password_hash, rol, municipio_id FROM usuarios WHERE email = $1 AND provider = $2',
            [email, 'email']
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const usuario = result.rows[0];
        const valido = await verifyPassword(password, usuario.password_hash);

        if (!valido) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = generateToken(usuario);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre,
                rol: usuario.rol,
                municipio_id: usuario.municipio_id
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
};

const obtenerPerfil = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const { verifyToken } = require('../utils/auth');
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        const result = await pool.query(
            `SELECT u.id, u.email, u.nombre, u.rol, u.municipio_id, m.nombre as municipio_nombre 
             FROM usuarios u 
             LEFT JOIN municipios m ON u.municipio_id = m.id 
             WHERE u.id = $1`,
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const googleCallback = async (req, res) => {
    try {
        const { generateToken } = require('../utils/auth');
        
        let result = await pool.query(
            `SELECT u.id, u.email, u.nombre, u.rol, u.municipio_id, u.provider, u.provider_id, u.email_verificado, m.nombre as municipio_nombre 
             FROM usuarios u 
             LEFT JOIN municipios m ON u.municipio_id = m.id 
             WHERE u.provider = $1 AND u.provider_id = $2`,
            ['google', req.user.id]
        );

        let usuario;
        if (result.rows.length === 0) {
            const newUser = await pool.query(
                `INSERT INTO usuarios (email, nombre, provider, provider_id, email_verificado) 
                 VALUES ($1, $2, 'google', $3, true) 
                 RETURNING id, email, nombre, rol, municipio_id`,
                [req.user.email, req.user.name, req.user.id]
            );
            usuario = newUser.rows[0];
        } else {
            usuario = result.rows[0];
            await pool.query('UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1', [usuario.id]);
        }

        const token = generateToken(usuario);

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.redirect('http://localhost:5173/auth/callback');
    } catch (error) {
        console.error('Error en Google callback:', error);
        res.redirect('http://localhost:5173/login?error=google_auth_failed');
    }
};

module.exports = { registrar, login, logout, obtenerPerfil, googleCallback };