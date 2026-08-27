const Joi = require('joi');

exports.updateProfileSchema = Joi.object({
  name: Joi.string().optional(),
  bio: Joi.string().max(300).optional().allow('', null),
  vibes: Joi.array().items(Joi.string()).optional(),
  color: Joi.string().optional(),
});
