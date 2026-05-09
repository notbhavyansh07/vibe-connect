const mongoose = require('mongoose');

/**
 * Chat represents a conversation between two users (1-to-1 for now,
 * but structured to support groups later).
 */
const ChatSchema = new mongoose.Schema(
  {
    participants: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      validate: [(v) => v.length >= 2, 'A chat needs at least 2 participants'],
    },
    // Denormalized for fast listing
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
  },
  { timestamps: true }
);

ChatSchema.index({ participants: 1 });

/**
 * Ensure we don't create duplicate 1-to-1 chats between the same users
 */
ChatSchema.statics.getOrCreateDirectChat = async function (userIdA, userIdB) {
  const existing = await this.findOne({
    isGroup: false,
    participants: { $all: [userIdA, userIdB] },
  });
  if (existing) return existing;
  return this.create({ participants: [userIdA, userIdB] });
};

module.exports = mongoose.model('Chat', ChatSchema);
