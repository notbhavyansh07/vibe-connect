const Joi = require('joi');

exports.createPostSchema = Joi.object({
  content: Joi.string().required().max(2000),
  image: Joi.string().optional().allow('', null),
  tag: Joi.string().optional().allow('', null),
});
