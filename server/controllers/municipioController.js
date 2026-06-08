const pool = require('../config/db');

exports.getMunicipios = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, nombre, region FROM municipios ORDER BY nombre'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener municipios:', error);
        res.status(500).json({ error: 'Error al obtener municipios' });
    }
};

exports.getMunicipioById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT id, nombre, region FROM municipios WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Municipio no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener municipio:', error);
        res.status(500).json({ error: 'Error al obtener municipio' });
    }
};
