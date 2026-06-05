const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/auth');
const plazaController = require('../controllers/plazaController');

router.get('/plazas', plazaController.getPlazas);
router.get('/plazas/:id', plazaController.getPlazaById);
router.get('/plazas/:id/reviews', plazaController.getReviewsByPlaza);
router.post('/plazas/:id/reviews', protegerRuta, plazaController.createReview);

module.exports = router;