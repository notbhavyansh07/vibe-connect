const mongoose = require('mongoose');
const User = require('../models/User');

/**
 * User profile service with follow logic.
 */

async function getProfile(query) {
  // 1. If it's a valid ObjectId, assume it's an ID
  if (mongoose.Types.ObjectId.isValid(query)) {
    const userById = await User.findById(query).select('-password -refreshToken').lean();
    if (userById) return userById;
  }

  // 2. Otherwise treatment it as a handle (with or without @)
  const handle = query.startsWith('@') ? query.toLowerCase().slice(1) : query.toLowerCase();
  return User.findOne({ handle }).select('-password -refreshToken').lean();
}

async function updateProfile(userId, updates) {
  const allowed = ['name', 'bio', 'handle', 'vibes', 'image', 'coverImage', 'color'];
  const filtered = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }
  return User.findByIdAndUpdate(userId, filtered, {
    new: true,
    runValidators: true,
  }).select('-password -refreshToken');
}

async function getRecommendedUsers(userId, limit = 10) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  return User.find({
    _id: { $ne: userId },
    isActive: true,
  })
    .select('name handle image vibes vibeScore followerCount')
    .sort({ vibeScore: -1 })
    .limit(limit)
    .lean();
}

module.exports = { getProfile, updateProfile, getRecommendedUsers };
