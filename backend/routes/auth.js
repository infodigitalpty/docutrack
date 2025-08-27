
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta de registro
// POST /api/auth/register
router.post('/register', authController.register);

// Ruta de login
// POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;
