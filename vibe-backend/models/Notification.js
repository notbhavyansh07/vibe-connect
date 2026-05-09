const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'message', 'vibe_match', 'system'],
    required: true,
  },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  message: { type: String, default: '' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

NotificationSchema.index({ receiverId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
