const express = require('express');
const { authController } = require('../controllers');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Rotas públicas
router.post('/login', authController.login);

// Rotas protegidas
router.get('/me', authMiddleware, authController.me);
router.put('/profile', authMiddleware, authController.updateProfile);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;