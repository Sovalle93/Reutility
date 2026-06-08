const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/auth');
const { setMunicipioContext } = require('../middleware/municipio');
const plazaController = require('../controllers/plazaController');

// Public routes - no municipio filtering
router.get('/plazas', plazaController.getPlazas);
router.get('/plazas/:id', plazaController.getPlazaById);
router.get('/plazas/:id/reviews', plazaController.getReviewsByPlaza);
router.get('/ranking', plazaController.getRanking);

// Protected routes - with municipio context
router.post('/plazas/:id/reviews', protegerRuta, setMunicipioContext, plazaController.createReview);

module.exports = router;