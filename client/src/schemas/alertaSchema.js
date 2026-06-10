import { z } from 'zod';

const categoriasValidas = ['basura', 'mantenimiento', 'vandalismo', 'seguridad', 'iluminacion', 'otro'];

export const alertaSchema = z.object({
    titulo: z
        .string({ required_error: 'El título es requerido' })
        .min(5, 'El título debe tener al menos 5 caracteres')
        .max(100, 'El título no puede exceder 100 caracteres'),
    descripcion: z
        .string({ required_error: 'La descripción es requerida' })
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(500, 'La descripción no puede exceder 500 caracteres'),
    categoria: z
        .string({ required_error: 'La categoría es requerida' })
        .refine((val) => categoriasValidas.includes(val), {
            message: `Categoría inválida. Opciones: ${categoriasValidas.join(', ')}`
        }),
    plaza_id: z
        .number({ required_error: 'La plaza es requerida' })
        .int('ID de plaza inválido')
        .positive('Debes seleccionar una plaza válida')
});

export const validateAlerta = (data) => alertaSchema.safeParse(data);