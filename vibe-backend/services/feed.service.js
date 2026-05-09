const Post = require('../models/Post');
const Follow = require('../models/Follow');
const User = require('../models/User');
const { cacheGet, cacheSet } = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Personalized feed service.
 * Builds a feed from:
 *  1. Posts from users the user follows (weighted highest)
 *  2. Posts matching user's vibe tags
 *  3. Trending / popular posts
 */

async function getPersonalizedFeed(userId, { page = 1, limit = 20 } = {}) {
  const cacheKey = `feed:personalized:${userId}:${page}:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return cached;

  const user = await User.findById(userId).select('vibes').lean();
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  // 1. Get users this person follows
  const following = await Follow.find({ followerId: userId }).distinct('followingId');

  const skip = (page - 1) * limit;

  // Build weighted query: following posts first, then vibe-matched, then trending
  let followPosts = [];
  let vibePosts = [];
  let generalPosts = [];

  if (following.length > 0) {
    followPosts = await Post.find({
      authorId: { $in: following },
      isActive: true,
    })
      .populate('authorId', 'name handle image vibes')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  // Fill remaining slots with vibe-matched posts (excluding follow posts already fetched)
  const excludeIds = new Set(followPosts.map((p) => p._id.toString()));

  if (user.vibes && user.vibes.length > 0) {
    vibePosts = await Post.find({
      isActive: true,
      authorId: { $nin: following },
      tag: { $in: user.vibes },
      _id: { $nin: [...excludeIds] },
    })
      .populate('authorId', 'name handle image vibes')
      .sort({ recommendationScore: -1, createdAt: -1 })
      .limit(limit - followPosts.length)
      .lean();

    vibePosts.forEach((p) => excludeIds.add(p._id.toString()));
  }

  // Fill remaining with general popular posts
  const remaining = Math.max(0, limit - followPosts.length - vibePosts.length);
  if (remaining > 0) {
    generalPosts = await Post.find({
      isActive: true,
      _id: { $nin: [...excludeIds] },
    })
      .populate('authorId', 'name handle image vibes')
      .sort({ likeCount: -1, createdAt: -1 })
      .limit(remaining)
      .lean();
  }

  // Merge: follow > vibe > general
  const feedPosts = [...followPosts, ...vibePosts, ...generalPosts].slice(0, limit);

  const result = {
    posts: feedPosts,
    pagination: { page, limit, total: feedPosts.length },
    source: {
      fromFollowing: followPosts.length,
      fromVibes: vibePosts.length,
      fromTrending: generalPosts.length,
    },
  };

  // Cache for 5 minutes
  await cacheSet(cacheKey, result, 300);

  return result;
}

module.exports = { getPersonalizedFeed };
