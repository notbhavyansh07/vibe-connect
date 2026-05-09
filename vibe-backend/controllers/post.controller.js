const { createPost, getFeed, getPostById, deletePost } = require('../services/post.service');
const { getPersonalizedFeed } = require('../services/feed.service');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Post controller – CRUD with like/comment support.
 */

exports.create = async (req, res, next) => {
  try {
    const authorId = req.user._id;
    const { content, tag } = req.body;

    // If file was uploaded via multer+Cloudinary, attach media info
    const media = req.file
      ? { url: req.file.path, publicId: req.file.filename, type: req.file.resource_type || 'image' }
      : undefined;

    const post = await createPost({ authorId, content, media, tag });

    // Invalidate feed cache
    await cacheDel('feed:*');

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = 'newest', tag } = req.query;
    const cacheKey = `feed:${page}:${limit}:${sort}:${tag || ''}`;

    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const feed = await getFeed({ page, limit, sort, tag });
    await cacheSet(cacheKey, feed, 300); // 5 min cache

    res.json(feed);
  } catch (err) {
    next(err);
  }
};

exports.personalizedFeed = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;
    const feed = await getPersonalizedFeed(userId, { page: parseInt(page), limit: parseInt(limit) });
    res.json(feed);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const post = await getPostById(req.params.id);
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const result = await deletePost(req.params.id, req.user._id);
    await cacheDel('feed:*');
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Likes
exports.toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const existing = await Like.findOne({ userId, postId });

    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      await Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
      return res.json({ liked: false });
    }

    await Like.create({ userId, postId });
    await Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });

    // Notify post author
    const post = await Post.findById(postId);
    if (post) {
      await Notification.create({
        receiverId: post.authorId,
        senderId: userId,
        type: 'like',
        postId,
        message: `${req.user.name} liked your post`,
      });
    }

    res.status(201).json({ liked: true });
  } catch (err) {
    next(err);
  }
};

exports.getLikeStatus = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const like = await Like.findOne({ userId: req.user._id, postId });
    res.json({ liked: !!like });
  } catch (err) {
    next(err);
  }
};

exports.getAllLikes = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const likes = await Like.find({ postId })
      .populate('userId', 'name handle image')
      .lean();
    res.json(likes.map((l) => l.userId));
  } catch (err) {
    next(err);
  }
};

// Comments
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;
    const authorId = req.user._id;

    const comment = await Comment.create({ authorId, postId, content });
    await Post.findByIdAndUpdate(postId, { $inc: { commentCount: 1 } });

    const post = await Post.findById(postId);
    if (post) {
      await Notification.create({
        receiverId: post.authorId,
        senderId: authorId,
        type: 'comment',
        postId,
        message: `${req.user.name} commented: ${content.slice(0, 50)}`,
      });
    }

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

exports.getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const comments = await Comment.find({ postId })
      .populate('authorId', 'name handle image')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Comment.countDocuments({ postId });

    res.json({
      comments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTrending = async (req, res, next) => {
  try {
    const trending = await Post.aggregate([
      { $match: { isActive: true, tag: { $ne: null, $exists: true } } },
      { $group: { _id: '$tag', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    res.json(trending);
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

    const posts = await Post.find({
      isActive: true,
      $or: [
        { content: { $regex: q, $options: 'i' } },
        { tag: { $regex: q, $options: 'i' } },
      ],
    })
      .populate('authorId', 'name handle image')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json(posts);
  } catch (err) {
    next(err);
  }
};
