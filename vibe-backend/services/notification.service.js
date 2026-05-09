const Notification = require('../models/Notification');

/**
 * Notification service – creates and manages user notifications.
 * Emits real-time events via Socket.IO when io is available.
 */

let io = null;

function setIo(socketIo) {
  io = socketIo;
}

async function create({ receiverId, senderId, type, postId, message }) {
  // Don't notify yourself
  if (senderId.toString() === receiverId.toString()) return null;

  const notification = await Notification.create({ receiverId, senderId, type, postId, message });

  // Emit real-time notification via WebSocket
  if (io) {
    const populated = await Notification.findById(notification._id)
      .populate('senderId', 'name handle image')
      .lean();
    io.to(receiverId.toString()).emit('notification', populated);
  }

  return notification;
}

async function getNotifications(userId, { page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ receiverId: userId })
      .populate('senderId', 'name handle image')
      .populate('postId', 'content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ receiverId: userId }),
  ]);

  return { notifications, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

async function markAsRead(notificationId, userId) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, receiverId: userId },
    { read: true },
    { new: true }
  );
}

async function markAllRead(userId) {
  await Notification.updateMany({ receiverId: userId, read: false }, { read: true });
  return { message: 'All notifications marked as read' };
}

async function getUnreadCount(userId) {
  const count = await Notification.countDocuments({ receiverId: userId, read: false });
  return { unread: count };
}

module.exports = { setIo, create, getNotifications, markAsRead, markAllRead, getUnreadCount };
