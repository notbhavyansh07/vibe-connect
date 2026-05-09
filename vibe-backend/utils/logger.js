const winston = require('winston');
const path = require('path');

/**
 * Winston logger – writes to console + rotating log files.
 * Use: logger.info('message'), logger.error('message'), etc.
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error',
      maxsize: 5_242_880, // 5 MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '../logs/combined.log'),
      maxsize: 5_242_880,
      maxFiles: 5,
    }),
  ],
});

// Also log to stdout during development / when testing
if (process.env.NODE_ENV !== 'production' || !require.main) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

module.exports = logger;
