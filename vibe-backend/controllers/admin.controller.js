const adminService = require('../services/admin.service');

/**
 * Admin controller – system stats, user management, moderation.
 * All routes should be guarded by admin middleware.
 */

exports.getDashboard = async (_req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (err) { next(err); }
};

exports.listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, q } = req.query;
    const result = await adminService.listUsers({ page: parseInt(page), limit: parseInt(limit), q });
    res.json(result);
  } catch (err) { next(err); }
};

exports.getUserDetail = async (req, res, next) => {
  try {
    const user = await adminService.getUserDetail(req.params.id);
    res.json(user);
  } catch (err) { next(err); }
};

exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { action } = req.body; // 'ban' | 'unban'
    const user = await adminService.toggleUserStatus(req.params.id, action);
    res.json(user);
  } catch (err) { next(err); }
};

exports.deletePost = async (req, res, next) => {
  try {
    await adminService.deletePost(req.params.postId);
    res.json({ message: 'Post removed by admin' });
  } catch (err) { next(err); }
};

exports.getRecentActivity = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const records = await adminService.getRecentActivity(parseInt(limit));
    res.json(records);
  } catch (err) { next(err); }
};

exports.getSystemHealth = async (req, res, next) => {
  try {
    const health = await adminService.getSystemHealth();
    res.json(health);
  } catch (err) { next(err); }
};
