const Joi = require('joi');

exports.createChatSchema = Joi.object({
  otherUserId: Joi.string().hex().length(24).required(),
});

exports.sendMessageSchema = Joi.object({
  chatId: Joi.string().hex().length(24).required(),
  content: Joi.string().min(1).max(2000).required(),
});
