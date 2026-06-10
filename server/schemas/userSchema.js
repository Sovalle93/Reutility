const { z } = require('zod');

const registerSchema = z.object({
    email: z
        .string({ required_error: 'El email es requerido' })
        .email('Email inválido')
        .min(5, 'Email demasiado corto')
        .max(255, 'Email demasiado largo'),
    password: z
        .string({ required_error: 'La contraseña es requerida' })
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
        .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
    nombre: z
        .string({ required_error: 'El nombre es requerido' })
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre es demasiado largo')
});

const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida')
});

const adminCreateUserSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    rol: z.enum(['ciudadano', 'fiscalizador', 'municipal_worker', 'admin']),
    municipio_id: z.number().nullable().optional()
}).refine((data) => {
    // Si es fiscalizador o municipal_worker, municipio_id es requerido
    if (data.rol === 'fiscalizador' || data.rol === 'municipal_worker') {
        return data.municipio_id !== null && data.municipio_id > 0;
    }
    return true;
}, {
    message: 'Municipio es requerido para fiscalizadores y trabajadores municipales',
    path: ['municipio_id']
});

const validateRegister = (data) => registerSchema.safeParse(data);
const validateLogin = (data) => loginSchema.safeParse(data);
const validateAdminCreateUser = (data) => adminCreateUserSchema.safeParse(data);

module.exports = { 
    registerSchema, 
    loginSchema, 
    adminCreateUserSchema,
    validateRegister, 
    validateLogin, 
    validateAdminCreateUser 
};