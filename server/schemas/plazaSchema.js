const { z } = require('zod');

const plazaSchema = z.object({
    nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(200),
    municipio_id: z.number().int().positive('Municipio inválido'),
    direccion: z.string().min(5, 'Dirección demasiado corta').optional(),
    latitud: z.number().min(-90).max(90),
    longitud: z.number().min(-180).max(180),
    descripcion: z.string().max(1000, 'Descripción demasiado larga').optional()
});

const validatePlaza = (data) => plazaSchema.safeParse(data);

module.exports = { plazaSchema, validatePlaza };