module.exports = (schema) => (req, res, next) => {
  if (!schema) return next();
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return res.status(400).json({ message });
  }
  next();
};
