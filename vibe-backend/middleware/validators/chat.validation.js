const Joi = require('joi');

exports.sendMessageSchema = Joi.object({
  chatId: Joi.string().required(),
  content: Joi.string().required(),
});
