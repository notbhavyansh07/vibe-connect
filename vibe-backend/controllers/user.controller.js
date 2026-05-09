const { getProfile, updateProfile, getRecommendedUsers } = require('../services/user.service');
const Notification = require('../models/Notification');
const Post = require('../models/Post');
const Follow = require('../models/Follow');
const logger = require('../utils/logger');

/**
 * User controller – profile, listing, follow relationships.
 */

exports.getProfile = async (req, res, next) => {
  try {
    const { handle } = req.params;
    const profile = await getProfile(handle);
    if (!profile) return res.status(404).json({ message: 'User not found' });

    // Enrich with cached counters
    const [postCount, followerCount, followingCount] = await Promise.all([
      Post.countDocuments({ authorId: profile._id, isActive: true }),
      Follow.countDocuments({ followingId: profile._id }),
      Follow.countDocuments({ followerId: profile._id }),
    ]);

    res.json({ ...profile, postCount, followerCount, followingCount });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await updateProfile(userId, req.body);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

exports.getRecommended = async (req, res, next) => {
  try {
    const users = await getRecommendedUsers(req.user._id, parseInt(req.query.limit) || 10);
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const users = await require('../models/User')
      .find({ isActive: true })
      .select('name handle image vibes vibeScore createdAt')
      .sort({ vibeScore: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await require('../models/User').countDocuments({ isActive: true });

    res.json({
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// Follow endpoints (moved here for coherence – keeps related routes together)
exports.follow = async (req, res, next) => {
  try {
    const followerId = req.user._id;
    const { followingId } = req.body;
    if (!followingId) {
      return res.status(400).json({ message: 'followingId is required' });
    }

    const exists = await Follow.findOne({ followerId, followingId });

    if (exists) {
      // Unfollow
      await Follow.deleteOne({ _id: exists._id });
      return res.json({ following: false });
    }

    // Follow
    await Follow.create({ followerId, followingId });
    await Notification.create({
      receiverId: followingId,
      senderId: followerId,
      type: 'follow',
      message: `${req.user.name} started following you`,
    });

    res.status(201).json({ following: true });
  } catch (err) {
    next(err);
  }
};

exports.getFollowStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followerId = req.user._id;

    const isFollowing = !!(await Follow.findOne({ followerId, followingId: userId }));
    res.json({ following: isFollowing, userId });
  } catch (err) {
    next(err);
  }
};

exports.getFollowers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followers = await Follow.find({ followingId: userId })
      .populate('followerId', 'name handle image vibes')
      .lean();
    res.json(followers.map((f) => f.followerId));
  } catch (err) {
    next(err);
  }
};

exports.getFollowing = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const following = await Follow.find({ followerId: userId })
      .populate('followingId', 'name handle image vibes')
      .lean();
    res.json(following.map((f) => f.followingId));
  } catch (err) {
    next(err);
  }
};

exports.getCurrentUser = async (req, res) => {
  res.json(req.user);
};
