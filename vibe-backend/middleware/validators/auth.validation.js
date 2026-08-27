const Joi = require('joi');

exports.registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  handle: Joi.string().optional().allow('', null),
  vibes: Joi.array().items(Joi.string()).optional(),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
