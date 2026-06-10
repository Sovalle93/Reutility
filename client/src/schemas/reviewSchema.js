// Para React (ES modules)
import { z } from 'zod';

export const reviewSchema = z.object({
    rating: z
        .number({ required_error: 'La calificación es requerida' })
        .int()
        .min(1, 'La calificación debe ser entre 1 y 5')
        .max(5, 'La calificación debe ser entre 1 y 5'),
    comentario: z
        .string({ required_error: 'El comentario es requerido' })
        .min(3, 'El comentario debe tener al menos 3 caracteres')
        .max(500, 'El comentario no puede exceder 500 caracteres')
});

export const validateReview = (data) => reviewSchema.safeParse(data);