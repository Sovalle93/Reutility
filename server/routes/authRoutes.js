const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const { validate } = require('../middleware/validate');
const { validateRegister, validateLogin } = require('../schemas/userSchema');

router.post('/register', validate(validateRegister), authController.registrar);
router.post('/login', validate(validateLogin), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.obtenerPerfil);
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);

module.exports = router;