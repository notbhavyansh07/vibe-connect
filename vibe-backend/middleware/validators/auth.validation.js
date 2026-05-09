const Joi = require('joi');

exports.registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  handle: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9-]+$/),
  vibes: Joi.array().items(Joi.string()),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

exports.refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
