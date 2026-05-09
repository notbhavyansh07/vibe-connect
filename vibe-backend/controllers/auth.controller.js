const { register, login, refresh, logout, googleLogin } = require('../services/auth.service');
const logger = require('../utils/logger');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, handle, vibes } = req.body;
    const result = await register({ name, email, password, handle, vibes });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await refresh(refreshToken);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    // Extract tokens from header and body
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const { refreshToken } = req.body;
    await logout(accessToken, refreshToken);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

exports.googleCallback = async (req, res, next) => {
  try {
    const { email, name, googleId } = req.body;
    const result = await googleLogin({ email, name, googleId });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};