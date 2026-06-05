const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const plazaRoutes = require('./routes/plazaRoutes');
const userRoutes = require('./routes/userRoutes');
const alertaRoutes = require('./routes/alertaRoutes');

// Configuraciones
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', plazaRoutes);
app.use('/api', userRoutes);
app.use('/api', alertaRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});