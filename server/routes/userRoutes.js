const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/auth');
const { setMunicipioContext } = require('../middleware/municipio');
const userController = require('../controllers/userController');

router.get('/mis-alertas', protegerRuta, userController.getMisAlertas);
router.get('/mis-reviews', protegerRuta, setMunicipioContext, userController.getMisReviews);
router.get('/plazas/:id/reviews/usuario', protegerRuta, setMunicipioContext, userController.getUserReview);
router.put('/reviews/:reviewId', protegerRuta, setMunicipioContext, userController.updateReview);
router.delete('/reviews/:reviewId', protegerRuta, setMunicipioContext, userController.deleteReview);

module.exports = router;