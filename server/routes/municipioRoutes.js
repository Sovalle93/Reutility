const express = require('express');
const router = express.Router();
const municipioController = require('../controllers/municipioController');

// Public routes
router.get('/municipios', municipioController.getMunicipios);
router.get('/municipios/:id', municipioController.getMunicipioById);

module.exports = router;
