const Chat = require('../models/Chat');
const Message = require('../models/Message');

/**
 * Chat & messaging service.
 */

async function getOrCreateDirectChat(userIdA, userIdB) {
  return Chat.getOrCreateDirectChat(userIdA, userIdB);
}

async function sendMessage({ chatId, senderId, content, media }) {
  const message = await Message.create({
    chatId,
    senderId,
    content: content || '',
    media,
  });

  // Update chat's last message reference
  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: content,
    lastMessageAt: new Date(),
  });

  return Message.findById(message._id)
    .populate('senderId', 'name handle image')
    .lean();
}

async function getMessages(chatId, { page = 1, limit = 30 } = {}) {
  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Message.find({ chatId })
      .populate('senderId', 'name handle image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Message.countDocuments({ chatId }),
  ]);

  return { messages: messages.reverse(), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

async function getUserChats(userId) {
  const chats = await Chat.find({ participants: userId })
    .populate('participants', 'name handle image')
    .sort({ lastMessageAt: -1 })
    .lean();

  return chats.map((chat) => {
    // Find the other participant
    const other = chat.participants.find(
      (p) => p?._id?.toString() !== userId.toString()
    );
    return { ...chat, otherParticipant: other || null };
  });
}

async function markMessagesRead(chatId, userId) {
  await Message.updateMany(
    { chatId, senderId: { $ne: userId }, read: false },
    { read: true, readAt: new Date() }
  );
  return { message: 'Messages marked as read' };
}

module.exports = { getOrCreateDirectChat, sendMessage, getMessages, getUserChats, markMessagesRead };
