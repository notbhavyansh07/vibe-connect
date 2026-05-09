const { verifyAccessToken } = require('../config/jwt');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');

/**
 * Protects a route – adds req.user from the access token.
 * Sends 401 if token is missing, expired, blacklisted, or invalid.
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Check if token is blacklisted (logged out)
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: 'Token has been revoked' });
    }

    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.id).select(
      '-password -refreshToken'
    );
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ message: 'User not found or deactivated' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * Optional auth – attaches req.user if token is valid, otherwise lets the request through.
 * Useful for public feeds that personalize when logged in.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next();
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
  } catch {
    // Ignore – auth is optional
  }
  next();
};

module.exports = { protect, optionalAuth };
