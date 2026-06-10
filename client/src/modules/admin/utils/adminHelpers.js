export const ROLE_LABELS = {
    ciudadano:      '👤 Ciudadano',
    fiscalizador:   '👮 Fiscalizador',
    municipal_worker: '🏛️ Trabajador',
    admin:          '👑 Admin',
};

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

export const MUNICIPIO_ROLES = ['fiscalizador', 'municipal_worker'];

export const requiresMunicipio = (rol) => MUNICIPIO_ROLES.includes(rol);

/**
 * @param {{ nombre: string, email: string, password: string, rol: string, municipio_id: string }} formData
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export const validateUserForm = (formData) => {
    const errors = {};
    if (!formData.nombre?.trim()) errors.nombre = 'El nombre es requerido';
    if (!formData.email?.trim()) errors.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email inválido';
    if (!formData.password) errors.password = 'La contraseña es requerida';
    else if (formData.password.length < 8) errors.password = 'Mínimo 8 caracteres';
    if (requiresMunicipio(formData.rol) && !formData.municipio_id) errors.municipio_id = 'Selecciona un municipio';
    return { valid: Object.keys(errors).length === 0, errors };
};

const PASSWORD_RULES = [
    (p) => p.length >= 8,
    (p) => p.length >= 12,
    (p) => /[A-Z]/.test(p),
    (p) => /[0-9]/.test(p),
    (p) => /[^A-Za-z0-9]/.test(p),
];

const STRENGTH_LEVELS = [
    { label: 'Muy débil', color: 'bg-red-500' },
    { label: 'Débil',     color: 'bg-orange-500' },
    { label: 'Regular',   color: 'bg-yellow-500' },
    { label: 'Buena',     color: 'bg-blue-500' },
    { label: 'Fuerte',    color: 'bg-green-500' },
];

/**
 * @param {string} password
 * @returns {{ score: number, label: string, color: string }}
 */
export const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    const score = PASSWORD_RULES.filter(rule => rule(password)).length;
    return { score, ...STRENGTH_LEVELS[Math.min(score, 4)] };
};
