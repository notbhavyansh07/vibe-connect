const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');

/**
 * Admin service – statistics, moderation, system health.
 */

async function getDashboardStats() {
  const [userCount, postCount, chatCount, messageCount] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments({ isActive: true }),
    Chat.countDocuments(),
    Message.countDocuments(),
  ]);

  const newUsersToday = await User.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  const newMessagesToday = await Message.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  return {
    totals: { users: userCount, posts: postCount, chats: chatCount, messages: messageCount },
    activity24h: { newUsers: newUsersToday, newMessages: newMessagesToday },
  };
}

async function listUsers({ page = 1, limit = 50, q }) {
  const query = q
    ? { $or: [{ name: { $regex: q, $options: 'i' } }, { email: { $regex: q, $options: 'i' } }, { handle: { $regex: q, $options: 'i' } }] }
    : {};

  const [users, total] = await Promise.all([
    User.find(query).select('-password -refreshToken').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    User.countDocuments(query),
  ]);

  return { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

async function getUserDetail(userId) {
  const user = await User.findById(userId).select('-password -refreshToken').lean();
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  const [postCount, followerCount, followingCount] = await Promise.all([
    Post.countDocuments({ authorId: userId, isActive: true }),
    Follow.countDocuments({ followingId: userId }),
    Follow.countDocuments({ followerId: userId }),
  ]);

  return { ...user, stats: { postCount, followerCount, followingCount } };
}

async function toggleUserStatus(userId, action) {
  if (!['ban', 'unban'].includes(action)) {
    throw Object.assign(new Error('Action must be "ban" or "unban"'), { statusCode: 400 });
  }
  const user = await User.findByIdAndUpdate(userId, { isActive: action === 'unban' }, { new: true }).select('-password -refreshToken');
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  return user;
}

async function deletePost(postId) {
  const post = await Post.findById(postId);
  if (!post) throw Object.assign(new Error('Post not found'), { statusCode: 404 });
  post.isActive = false;
  await post.save();
  return { message: 'Post removed' };
}

async function getRecentActivity(limit = 50) {
  const [recentPosts, recentUsers, recentMessages] = await Promise.all([
    Post.find().select('authorId content createdAt').sort({ createdAt: -1 }).limit(limit).populate('authorId', 'name handle').lean(),
    User.find().select('name email createdAt').sort({ createdAt: -1 }).limit(limit).lean(),
    Message.find().select('senderId content createdAt').sort({ createdAt: -1 }).limit(limit).populate('senderId', 'name handle').lean(),
  ]);

  return { recentPosts, recentUsers, recentMessages };
}

async function getSystemHealth() {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;
  const dbStates = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  let redisStatus = 'unavailable';
  try {
    const { getRedisClient } = require('../config/redis');
    const client = getRedisClient();
    const pong = await client.ping();
    redisStatus = pong === 'PONG' ? 'connected' : 'error';
  } catch {
    redisStatus = 'disconnected';
  }

  return {
    uptime: process.uptime(),
    memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    database: dbStates[dbState] || 'unknown',
    redis: redisStatus,
    pid: process.pid,
    nodeVersion: process.version,
  };
}

module.exports = {
  getDashboardStats,
  listUsers,
  getUserDetail,
  toggleUserStatus,
  deletePost,
  getRecentActivity,
  getSystemHealth,
};
