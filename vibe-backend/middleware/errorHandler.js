const logger = require('../utils/logger');

/**
 * Global error handler – catches any unhandled error and
 * returns a clean JSON response.
 */
const errorHandler = (err, _req, res, _next) => {
  logger.error(err.stack || err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(', ') });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res
      .status(409)
      .json({ message: `${field} already exists` });
  }

  // Mongoose cast error (bad ObjectId)
  if (err.kind === 'ObjectId' || err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Default
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
