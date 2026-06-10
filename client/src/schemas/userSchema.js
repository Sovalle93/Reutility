import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

export const registerSchema = z.object({
    email: z
        .string({ required_error: 'El email es requerido' })
        .email('Email inválido')
        .max(255, 'Email demasiado largo'),
    password: z
        .string({ required_error: 'La contraseña es requerida' })
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
        .regex(/[0-9]/, 'La contraseña debe tener al menos un número'),
    nombre: z
        .string({ required_error: 'El nombre es requerido' })
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre es demasiado largo'),
});

export const adminCreateUserSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    rol: z.enum(['ciudadano', 'fiscalizador', 'municipal_worker', 'admin'], {
        errorMap: () => ({ message: 'Rol inválido' }),
    }),
    // Select elements return strings; coerce to number, treat empty string as null
    municipio_id: z.preprocess(
        (val) => (val === '' || val == null) ? null : Number(val),
        z.number().positive('ID de municipio inválido').nullable().optional()
    ),
}).refine(
    (data) => {
        if (data.rol === 'fiscalizador' || data.rol === 'municipal_worker') {
            return data.municipio_id != null && data.municipio_id > 0;
        }
        return true;
    },
    { message: 'Municipio es requerido para fiscalizadores y trabajadores municipales', path: ['municipio_id'] }
);

export const validateLogin = (data) => loginSchema.safeParse(data);
export const validateRegister = (data) => registerSchema.safeParse(data);
export const validateAdminCreateUser = (data) => adminCreateUserSchema.safeParse(data);
