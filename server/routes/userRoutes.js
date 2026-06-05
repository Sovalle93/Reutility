const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/mis-reviews', protegerRuta, userController.getMisReviews);
router.get('/plazas/:id/reviews/usuario', protegerRuta, userController.getUserReview);
router.put('/reviews/:reviewId', protegerRuta, userController.updateReview);
router.delete('/reviews/:reviewId', protegerRuta, userController.deleteReview);

module.exports = router;