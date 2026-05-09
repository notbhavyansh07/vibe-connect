const Joi = require('joi');

exports.createPostSchema = Joi.object({
  content: Joi.string().min(1).max(2000).required(),
  tag: Joi.string().max(50).allow(''),
});

exports.postIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
