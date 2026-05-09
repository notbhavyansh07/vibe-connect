const Joi = require('joi');

exports.updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  bio: Joi.string().max(300),
  handle: Joi.string().min(3).max(30).pattern(/^[a-zA-Z0-9-]+$/),
  vibes: Joi.array().items(Joi.string()),
  image: Joi.string().uri(),
  coverImage: Joi.string().uri(),
  color: Joi.string(),
});
