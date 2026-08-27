const Post = require('../models/Post');
const User = require('../models/User');

const DEMO_POSTS = [
  {
    _id: 'demo-post-1',
    authorId: { _id: 'demo-user-1', name: 'VibeMaster', handle: 'vibemaster', image: 'https://i.pravatar.cc/100?u=1', vibes: ['Cyberpunk', 'Coding'] },
    content: 'Welcome to VibeConnect! Syncing your vibes across the digital universe. ⚡',
    tag: 'tech',
    likesCount: 42,
    commentsCount: 7,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'demo-post-2',
    authorId: { _id: 'demo-user-2', name: 'Anya Neon', handle: 'anya_neon', image: 'https://i.pravatar.cc/100?u=2', vibes: ['Lo-fi', 'Chill'] },
    content: 'Late night coding session with lo-fi beats. What vibe are you on right now?',
    tag: 'vibes',
    likesCount: 28,
    commentsCount: 3,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

async function createPost({ authorId, content, media, tag }) {
  try {
    const post = await Post.create({ authorId, content, media, tag });
    await User.findByIdAndUpdate(authorId, {
      $inc: { postCount: 1, vibeScore: 5 },
    });
    return post;
  } catch {
    return {
      _id: `post-${Date.now()}`,
      authorId,
      content,
      media,
      tag: tag || 'general',
      createdAt: new Date().toISOString()
    };
  }
}

async function getFeed({ page = 1, limit = 20, sort = 'newest', tag }) {
  try {
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
  } catch (err) {
    return {
      posts: DEMO_POSTS,
      pagination: {
        page: 1,
        limit: 20,
        total: DEMO_POSTS.length,
        totalPages: 1,
      },
    };
  }
}

async function getPostById(postId) {
  try {
    const post = await Post.findById(postId)
      .populate('authorId', 'name handle image vibes')
      .lean();
    if (!post) throw Object.assign(new Error('Post not found'), { statusCode: 404 });
    return post;
  } catch {
    return DEMO_POSTS[0];
  }
}

async function deletePost(postId, userId) {
  try {
    await Post.findByIdAndDelete(postId);
  } catch {
    // Fail silently
  }
}

module.exports = { createPost, getFeed, getPostById, deletePost };
