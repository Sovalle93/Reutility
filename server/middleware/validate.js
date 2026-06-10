/**
 * Factory function to create validation middleware for Express
 * @param {Function} validator - Zod schema's safeParse method
 * @param {string} source - 'body', 'params', or 'query' (default: 'body')
 * @returns {Function} Express middleware
 */
const validate = (validator, source = 'body') => {
    return (req, res, next) => {
        const data = req[source];
        const result = validator(data);
        
        if (!result.success) {
            const errors = result.error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));
            
            return res.status(400).json({
                error: 'Datos inválidos',
                details: errors
            });
        }
        
        // Replace with validated data (sanitized)
        req[source] = result.data;
        next();
    };
};

module.exports = { validate };