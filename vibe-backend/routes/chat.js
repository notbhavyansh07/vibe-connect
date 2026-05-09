const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { createChatSchema, sendMessageSchema } = require('../middleware/validators/chat.validation');
const { getUploader } = require('../utils/upload');
const chatController = require('../controllers/chat.controller');

const upload = getUploader('vibe-connect/messages');

/**
 * Chat routes (all protected)
 * GET    /api/chat            – list user's chats
 * POST   /api/chat            – create or get direct chat with user
 * POST   /api/chat/send       – send a message
 * GET    /api/chat/:chatId    – get messages for a chat
 * PATCH  /api/chat/:chatId/read – mark messages as read
 */
router.use(protect);

router.get('/', chatController.listChats);
router.post('/', validate(createChatSchema), chatController.createChat);
router.post('/send', upload.single('media'), validate(sendMessageSchema), chatController.send);
router.get('/:chatId', chatController.getChat);
router.patch('/:chatId/read', chatController.markRead);

module.exports = router;
