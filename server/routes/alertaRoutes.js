const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protegerRuta } = require('../middleware/auth');
const alertController = require('../controllers/alertController');

// Configurar multer para almacenar imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'alerta-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'));
        }
    }
});

// Rutas
router.get('/alertas', alertController.getAlertas);
router.get('/alertas/:id', alertController.getAlertaById);
router.post('/alertas', protegerRuta, upload.single('imagen'), alertController.createAlerta);
router.put('/alertas/:id/status', protegerRuta, alertController.updateAlertaStatus);
router.get('/mis-alertas', protegerRuta, alertController.getMisAlertas);

module.exports = router;
