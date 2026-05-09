const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const notifController = require('../controllers/notification.controller');

/**
 * Notification routes (all protected)
 * GET    /api/notifications            – get paginated notifications
 * GET    /api/notifications/unread     – unread count
 * PATCH  /api/notifications/:id/read   – mark single as read
 * PATCH  /api/notifications/read-all   – mark all as read
 */
router.use(protect);

router.get('/', notifController.get);
router.get('/unread', notifController.unreadCount);
router.patch('/:id/read', notifController.markRead);
router.patch('/read-all', notifController.markAllRead);

module.exports = router;
