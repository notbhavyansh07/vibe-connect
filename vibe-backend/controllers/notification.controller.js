const notifService = require('../services/notification.service');

/**
 * Notification controller – CRUD for notifications.
 */

exports.get = async (req, res, next) => {
  try {
    const result = await notifService.getNotifications(req.user._id, {
      page: req.query.page,
      limit: req.query.limit,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const notif = await notifService.markAsRead(req.params.id, req.user._id);
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json(notif);
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    const result = await notifService.markAllRead(req.user._id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.unreadCount = async (req, res, next) => {
  try {
    const count = await notifService.getUnreadCount(req.user._id);
    res.json(count);
  } catch (err) {
    next(err);
  }
};
