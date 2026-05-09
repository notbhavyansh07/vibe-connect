const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { registerSchema, loginSchema, refreshSchema } = require('../middleware/validators/auth.validation');
const authController = require('../controllers/auth.controller');

/**
 * Authentication routes
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/refresh
 * POST /api/auth/logout (protected)
 * POST /api/auth/google (OAuth callback)
 * GET  /api/auth/me (protected)
 */
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshSchema), authController.refreshToken);
router.post('/logout', protect, authController.logoutUser);
router.post('/google', authController.googleCallback);
router.get('/me', protect, require('../controllers/user.controller').getCurrentUser);

module.exports = router;
