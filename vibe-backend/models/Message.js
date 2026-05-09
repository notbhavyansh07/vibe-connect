const mongoose = require('mongoose');

/**
 * Individual message inside a chat.
 */
const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    // Media messages
    media: {
      url: { type: String },
      type: { type: String, enum: ['image', 'video', null] },
    },
    read: { type: Boolean, default: false },
    readAt: { type: Date },
  },
  { timestamps: true }
);

MessageSchema.index({ chatId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
