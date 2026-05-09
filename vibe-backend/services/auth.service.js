const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const { generateAccessToken, generateRefreshToken } = require('../config/jwt');
const logger = require('../utils/logger');

/**
 * Auth service – registration, login, refresh, logout, google OAuth.
 */

async function register({ name, email, password, handle, vibes }) {
  const exists = await User.findOne({
    $or: [{ email }, ...(handle ? [{ handle }] : [])],
  });
  if (exists) {
    throw Object.assign(new Error('Email or handle already taken'), { statusCode: 409 });
  }

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hash, vibes });

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  logger.info(`New user registered: ${user.email}`);
  return { user: user.toObject({ virtuals: true }), accessToken, refreshToken };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || !user.password) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user: user.toObject({ virtuals: true }), accessToken, refreshToken };
}

async function refresh(refreshToken) {
  if (!refreshToken) {
    throw Object.assign(new Error('No refresh token'), { statusCode: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });
  }

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== refreshToken) {
    throw Object.assign(new Error('Refresh token revoked'), { statusCode: 401 });
  }

  // Rotate tokens
  const newAccessToken = generateAccessToken(user._id, user.role);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

async function logout(accessToken, refreshToken) {
  // Blacklist the access token so it can't be reused
  if (accessToken) {
    try {
      const decoded = jwt.decode(accessToken);
      if (decoded && decoded.exp) {
        await TokenBlacklist.findOneAndUpdate(
          { token: accessToken },
          { token: accessToken, expiresAt: new Date(decoded.exp * 1000) },
          { upsert: true }
        );
      }
    } catch { /* ignore */ }
  }

  // Clear the refresh token from the user
  if (refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      await User.findByIdAndUpdate(decoded.id, { refreshToken: null });
    } catch { /* ignore */ }
  }
}

async function googleLogin({ email, name, googleId }) {
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name, email, oauthProvider: 'google', oauthId: googleId, vibes: [],
    });
    logger.info(`New Google OAuth user: ${email}`);
  } else if (!user.oauthId) {
    // Link Google OAuth to existing account
    user.oauthProvider = 'google';
    user.oauthId = googleId;
    await user.save();
  }

  if (!user.isActive) {
    throw Object.assign(new Error('Account has been deactivated'), { statusCode: 403 });
  }

  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user: user.toObject({ virtuals: true }), accessToken, refreshToken };
}

module.exports = { register, login, refresh, logout, googleLogin };