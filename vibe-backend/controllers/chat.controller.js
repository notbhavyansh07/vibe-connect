const { getOrCreateDirectChat, sendMessage, getMessages, getUserChats, markMessagesRead } = require('../services/chat.service');
const { cacheDel } = require('../config/redis');
const Notification = require('../models/Notification');

/**
 * Chat controller – HTTP layer for chat.
 * Real-time broadcasting happens in the Socket.IO handler.
 */

exports.listChats = async (req, res, next) => {
  try {
    const chats = await getUserChats(req.user._id);
    res.json(chats);
  } catch (err) {
    next(err);
  }
};

exports.getChat = async (req, res, next) => {
  try {
    const messages = await getMessages(req.params.chatId, {
      page: req.query.page,
      limit: req.query.limit,
    });
    res.json(messages);
  } catch (err) {
    next(err);
  }
};

exports.createChat = async (req, res, next) => {
  try {
    const { otherUserId } = req.body;
    if (!otherUserId) {
      return res.status(400).json({ message: 'otherUserId is required' });
    }
    const chat = await getOrCreateDirectChat(req.user._id, otherUserId);
    res.status(201).json(chat);
  } catch (err) {
    next(err);
  }
};

exports.send = async (req, res, next) => {
  try {
    const { chatId, content } = req.body;
    const { io } = req.app.locals; // Socket.IO instance attached in server.js

    const message = await sendMessage({
      chatId,
      senderId: req.user._id,
      content,
      media: req.file
        ? { url: req.file.path, type: req.file.resource_type || 'image' }
        : undefined,
    });

    // Broadcast to room
    if (io) {
      io.to(chatId).emit('new-message', message);
    }

    // Store notification for receiver
    const chat = await require('../models/Chat').findById(chatId);
    if (chat) {
      const receiver = chat.participants.find(
        (p) => p.toString() !== req.user._id.toString()
      );
      if (receiver) {
        await Notification.create({
          receiverId: receiver,
          senderId: req.user._id,
          type: 'message',
          postId: chatId,
          message: `${req.user.name}: ${content.slice(0, 50)}`,
        });
      }
    }

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const result = await markMessagesRead(req.params.chatId, req.user._id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
