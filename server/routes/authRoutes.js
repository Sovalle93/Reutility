const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

router.post('/register', authController.registrar);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.obtenerPerfil);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);

module.exports = router;