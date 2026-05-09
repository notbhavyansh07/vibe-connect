const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');
const adminController = require('../controllers/admin.controller');

/**
 * Admin routes – all require auth + admin role
 * Base: /api/admin
 */
router.use(protect);
router.use(requireAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/health', adminController.getSystemHealth);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserDetail);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.get('/activity', adminController.getRecentActivity);
router.delete('/posts/:postId', adminController.deletePost);

module.exports = router;