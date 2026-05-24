const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validate, registerRules, loginRules, forgotPasswordRules } = require('../middleware/validators');
const {
  register, login, logout, getMe, forgotPassword, resetPassword,
} = require('../controllers/authController');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPasswordRules, validate, forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
