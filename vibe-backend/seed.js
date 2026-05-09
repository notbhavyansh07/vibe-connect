/**
 * Seed script – populates the DB with sample data for testing.
 * Run: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Post = require('./models/Post');
const Follow = require('./models/Follow');
const Like = require('./models/Like');
const Comment = require('./models/Comment');
const Chat = require('./models/Chat');
const Message = require('./models/Message');
const VibeMatch = require('./models/VibeMatch');
const Notification = require('./models/Notification');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vibe-connect-seed';

const VIBES_POOL = [
  'lofi', 'cyberpunk', 'vaporwave', 'minimalist', 'dark_academia',
  'aesthetic', 'chill', 'retro', 'neon', 'synthwave',
  'jazz', 'ambient', 'dream-pop', 'indie', 'hip-hop',
  'nature', 'coding', 'anime', 'gaming', 'fitness',
];

const POST_CONTENT = [
  'Late night coding sessions hit different with lofi in the background 🎧',
  'Neon lights and city vibes ✨',
  'Just discovered the perfect synthwave playlist for rainy days',
  'Minimalist setup = maximum productivity',
  'Cyberpunk aesthetics never get old 🌃',
  'Finding peace in small moments ☁️',
  'New track dropped! Check it out 🎵',
  'Dark academia reading list for autumn 📚',
  'Sunset vibes from the rooftop 🌅',
  'Building something cool this weekend 💻',
];

async function seed() {
  console.log(`Connecting to ${MONGODB_URI}...`);
  await mongoose.connect(MONGODB_URI);
  console.log('Connected, clearing old data...');

  // Clear existing
  await Promise.all([
    User.deleteMany({}),
    Post.deleteMany({}),
    Follow.deleteMany({}),
    Like.deleteMany({}),
    Comment.deleteMany({}),
    Chat.deleteMany({}),
    Message.deleteMany({}),
    VibeMatch.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  console.log('Creating users...');
  const users = [];

  // Create 10 sample users with varied vibes
  for (let i = 1; i <= 10; i++) {
    const userVibes = VIBES_POOL.sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 4));
    const user = await User.create({
      name: `User ${i}`,
      email: `user${i}@vibe.test`,
      password: await bcrypt.hash('password123', 12),
      handle: `user${i}`,
      bio: `Just vibing. Interests: ${userVibes.join(', ')}`,
      vibes: userVibes,
      vibeScore: 1000 + Math.floor(Math.random() * 2000),
    });
    users.push(user);
  }

  // Admin user
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@vibe.test',
    password: await bcrypt.hash('admin123', 12),
    handle: 'admin',
    bio: 'Platform admin',
    vibes: ['lofi', 'cyberpunk', 'coding'],
    vibeScore: 5000,
    role: 'admin',
  });
  users.push(admin);

  console.log(`Created ${users.length} users`);

  // Create posts
  console.log('Creating posts...');
  const posts = [];
  for (const user of users.slice(0, 10)) {
    for (let i = 0; i < 5; i++) {
      const post = await Post.create({
        authorId: user._id,
        content: POST_CONTENT[Math.floor(Math.random() * POST_CONTENT.length)],
        tag: user.vibes[Math.floor(Math.random() * user.vibes.length)],
        recommendationScore: Math.floor(Math.random() * 100),
        likeCount: Math.floor(Math.random() * 50),
        commentCount: Math.floor(Math.random() * 10),
      });
      posts.push(post);
    }
  }
  console.log(`Created ${posts.length} posts`);

  // Create follows
  console.log('Creating follows...');
  for (const user of users.slice(0, 10)) {
    const followTargets = users.slice(0, 10).filter((u) => u._id.toString() !== user._id.toString());
    const toFollow = followTargets.sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3));
    for (const target of toFollow) {
      await Follow.create({ followerId: user._id, followingId: target._id });
    }
  }

  // Create likes & comments
  for (const post of posts.slice(0, 20)) {
    const likers = users.slice(0, 5).sort(() => Math.random() - 0.5).slice(0, 3);
    for (const liker of likers) {
      await Like.create({ userId: liker._id, postId: post._id });
    }
    await Comment.create({ authorId: users[0]._id, postId: post._id, content: 'Nice vibes! 🔥' });
    if (Math.random() > 0.5) {
      await Comment.create({ authorId: users[1]._id, postId: post._id, content: 'Love this!' });
    }
  }

  // Create a direct chat between user 1 and user 2
  console.log('Creating chat...');
  const chat = await Chat.create({
    participants: [users[0]._id, users[1]._id],
    lastMessage: 'Hey, great vibe match!',
    lastMessageAt: new Date(),
  });

  await Message.create({
    chatId: chat._id,
    senderId: users[0]._id,
    content: 'Hey! We matched on lofi vibes 🎧',
  });
  await Message.create({
    chatId: chat._id,
    senderId: users[1]._id,
    content: 'Right? The algorithm knows us 😄',
  });

  // Create sample vibe matches
  console.log('Creating vibe matches...');
  await VibeMatch.create({
    userA: users[0]._id,
    userB: users[1]._id,
    score: 78,
    commonVibes: ['lofi', 'chill'],
    algorithm: 'jaccard',
  });
  await VibeMatch.create({
    userA: users[0]._id,
    userB: users[2]._id,
    score: 65,
    commonVibes: ['cyberpunk', 'neon'],
    algorithm: 'jaccard',
  });

  // Notifications
  await Notification.create({
    receiverId: users[0]._id,
    senderId: users[1]._id,
    type: 'like',
    postId: posts[0]._id,
    message: 'User 2 liked your post',
  });
  await Notification.create({
    receiverId: users[0]._id,
    senderId: users[3]._id,
    type: 'follow',
    message: 'User 4 started following you',
  });

  console.log('✅ Seed complete!');
  console.log('\nTest accounts:');
  console.log('  admin@vibe.test / admin123');
  console.log('  user1@vibe.test / password123');
  console.log('  user2@vibe.test / password123\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
