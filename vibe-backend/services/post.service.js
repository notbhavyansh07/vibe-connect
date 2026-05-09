const Post = require('../models/Post');
const User = require('../models/User');

/**
 * Post service – CRUD for posts with pagination support.
 */

async function createPost({ authorId, content, media, tag }) {
  const post = await Post.create({ authorId, content, media, tag });

  // Bump author's post count
  await User.findByIdAndUpdate(authorId, {
    $inc: { postCount: 1, vibeScore: 5 },
  });

  return post;
}

/**
 * Paginated feed with sorting options.
 */
async function getFeed({ page = 1, limit = 20, sort = 'newest', tag }) {
  const skip = (page - 1) * limit;
  const query = { isActive: true };
  if (tag) query.tag = tag;

  const sortBy = sort === 'popular' ? { recommendationScore: -1 } : { createdAt: -1 };

  const posts = await Post.find(query)
    .populate('authorId', 'name handle image vibes')
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Post.countDocuments(query);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Single post with like/comment counts.
 */
async function getPostById(postId) {
  const post = await Post.findById(postId)
    .populate('authorId', 'name handle image vibez')
    .lean();
  if (!post) throw Object.assign(new Error('Post not found'), { statusCode: 404 });
  return post;
}

async function deletePost(postId, userId) {
  const post = await Post.findById(postId);
  if (!post) throw Object.assign(new Error('Post not found'), { statusCode: 404 });
  if (post.authorId.toString() !== userId.toString()) {
    throw Object.assign(new Error('Not authorized'), { statusCode: 403 });
  }

  post.isActive = false;
  await post.save();

  await User.findByIdAndUpdate(userId, {
    $inc: { postCount: -1 },
  });

  return { message: 'Post deleted' };
}

module.exports = { createPost, getFeed, getPostById, deletePost };
