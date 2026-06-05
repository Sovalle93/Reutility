const pool = require('../config/db');
const { generateToken } = require('../utils/auth');

const googleCallback = async (req, res) => {
    try {
        // Datos que Google devuelve (pasados por el middleware de passport)
        const { id, email, name } = req.user;
        
        // Buscar o crear usuario
        let result = await pool.query(
            'SELECT * FROM usuarios WHERE provider = $1 AND provider_id = $2',
            ['google', id]
        );
        
        let usuario;
        
        if (result.rows.length === 0) {
            // Crear nuevo usuario con Google
            result = await pool.query(
                `INSERT INTO usuarios (email, nombre, provider, provider_id, email_verificado) 
                 VALUES ($1, $2, 'google', $3, true) 
                 RETURNING id, email, nombre, rol`,
                [email, name, id]
            );
            usuario = result.rows[0];
        } else {
            usuario = result.rows[0];
            // Actualizar último acceso
            await pool.query('UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id = $1', [usuario.id]);
        }
        
        // Generar token
        const token = generateToken(usuario);
        
        // Redirigir al frontend con el token
        res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
        
    } catch (error) {
        console.error('Error en Google callback:', error);
        res.redirect('http://localhost:5173/login?error=google_auth_failed');
    }
};

module.exports = { googleCallback };