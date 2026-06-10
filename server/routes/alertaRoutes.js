const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/auth');
const { setMunicipioContext } = require('../middleware/municipio');
const alertController = require('../controllers/alertController');
const multer = require('multer');
const path = require('path');
const { validate } = require('../middleware/validate');
const { validateAlerta } = require('../schemas/alertaSchema');

// Configuración de multer para imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes'));
    }
});

// Rutas públicas
router.get('/alertas', alertController.getAlertas);
router.get('/alertas/:id', alertController.getAlertaById);

// Rutas protegidas
router.post('/alertas', protegerRuta, upload.single('imagen'), validate(validateAlerta, 'body'), alertController.createAlerta);
router.put('/alertas/:id/status', protegerRuta, setMunicipioContext, alertController.updateAlertaStatus);
router.get('/mis-alertas', protegerRuta, alertController.getMisAlertas);

module.exports = router;