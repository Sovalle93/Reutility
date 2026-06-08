/**
 * Municipality context middleware
 * Attaches municipio filtering context to req object
 * Ensures users can only access data from their assigned municipality
 */

const setMunicipioContext = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const { id, rol, municipio_id } = req.usuario;

    /**
     * Check if user can access a specific municipality
     * Admins can access all, fiscalizadores and municipal_workers can only access their own
     */
    const canAccessMunicipio = (targetMunicipioId) => {
        if (rol === 'admin') return true;
        if (rol === 'fiscalizador' || rol === 'municipal_worker') {
            return municipio_id === targetMunicipioId;
        }
        return false; // ciudadanos can't restrict by municipio via this check
    };

    /**
     * Get the municipio filter clause based on user role
     * Returns: { clause: string, params: [] } or null if no filtering needed
     */
    const getMunicipioFilter = () => {
        if (rol === 'admin') {
            return null; // admins see all
        }
        if (rol === 'fiscalizador' || rol === 'municipal_worker') {
            return {
                clause: 'AND municipio_id = $1',
                params: [municipio_id]
            };
        }
        return null; // ciudadanos see all by default (UI filters apply instead)
    };

    /**
     * Inject municipio_id into WHERE clause for this user
     * Used primarily for restricted roles
     */
    const shouldFilterByMunicipio = () => {
        return (rol === 'fiscalizador' || rol === 'municipal_worker');
    };

    // Attach context to request
    req.municipioContext = {
        canAccessMunicipio,
        getMunicipioFilter,
        shouldFilterByMunicipio,
        userMunicipioId: municipio_id,
        userRol: rol,
        userId: id
    };

    next();
};

module.exports = { setMunicipioContext };
