class AppError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        if (code) this.code = code;
        this.isOperational = true;
    }
}

const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(`[${req.method} ${req.path}]`, err.stack || err.message);
    }

    if (err.isOperational && err.statusCode) {
        return res.status(err.statusCode).json({
            error: err.message,
            ...(err.code && { code: err.code }),
        });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = { errorHandler, AppError };
