/**
 * Generic validation middleware factory.
 * Usage: route.post('/register', validate(registerSchema), authController.register)
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      message: error.details.map((d) => d.message).join(', '),
      details: error.details.map((d) => ({ field: d.path.join('.'), message: d.message })),
    });
  }
  next();
};

module.exports = validate;
