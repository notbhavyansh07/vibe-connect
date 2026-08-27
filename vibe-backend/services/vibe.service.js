const User = require('../models/User');
const VibeMatch = require('../models/VibeMatch');
const Post = require('../models/Post');

/**
 * Vibe matching + AI recommendation service.
 */

/**
 * Cosine similarity between two 5D trait vectors: [music, energy, gaming, deepTalks, night]
 * Includes divide-by-zero protection & 0–100 range input clamping.
 */
function cosineSimilarity5D(vecA, vecB) {
  if (!vecA || !vecB || !Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== 5 || vecB.length !== 5) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < 5; i++) {
    const a = Math.max(0, Math.min(100, Number(vecA[i]) || 0));
    const b = Math.max(0, Math.min(100, Number(vecB[i]) || 0));
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }
  if (normA === 0 || normB === 0) return 0;
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.min(1.0, Math.max(0.0, similarity));
}

/**
 * Jaccard index: |A ∩ B| / |A ∪ B|
 */
function jaccardSimilarity(a, b) {
  if (!a.length && !b.length) return 0;
  const setA = new Set(a);
  const setB = new Set(b);

  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;

  return union === 0 ? 0 : intersection / union;
}

/**
 * Compute match between two users and persist it.
 */
async function computeMatch(userAId, userBId) {
  const [userA, userB] = await Promise.all([
    User.findById(userAId),
    User.findById(userBId),
  ]);
  if (!userA || !userB) throw new Error('One or both users not found');

  let score = 0;
  const commonVibes = [];

  // 1. Vibe similarity (0–60 points)
  const vibeSim = jaccardSimilarity(userA.vibes || [], userB.vibes || []);
  score += Math.round(vibeSim * 60);
  commonVibes.push(
    ...(userA.vibes || []).filter((v) => (userB.vibes || []).includes(v))
  );

  // 2. Activity overlap (0–20 points) – shared tags in recent posts
  const [postsA, postsB] = await Promise.all([
    Post.find({ authorId: userAId }).distinct('tag').limit(50),
    Post.find({ authorId: userBId }).distinct('tag').limit(50),
  ]);
  const tagSim = jaccardSimilarity(
    postsA.filter(Boolean),
    postsB.filter(Boolean)
  );
  score += Math.round(tagSim * 20);

  // 3. Vibe score proximity (0–20 points)
  const diff = Math.abs(userA.vibeScore - userB.vibeScore);
  const proximity = Math.max(0, 1 - diff / 5000);
  score += Math.round(proximity * 20);

  // Normalize to 0-100
  score = Math.min(100, Math.max(0, score));

  // Ensure consistent ordering (always userA < userB)
  const [first, second] =
    userAId.toString() < userBId.toString()
      ? [userAId, userBId]
      : [userBId, userAId];

  // Upsert
  return VibeMatch.findOneAndUpdate(
    { userA: first, userB: second },
    { score, commonVibes, algorithm: 'jaccard' },
    { upsert: true, new: true }
  );
}

/**
 * Find top N matches for a user.
 */
async function getTopMatches(userId, limit = 10) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const candidates = await User.find({
    _id: { $ne: userId },
    vibes: { $in: user.vibes || [] },
    isActive: true,
  }).select('_id name handle image vibes');

  const matchPromises = candidates.slice(0, 100).map((c) =>
    computeMatch(userId, c._id)
  );

  await Promise.allSettled(matchPromises);

  const matches = await VibeMatch.find({
    $or: [{ userA: userId }, { userB: userId }],
  })
    .populate('userA', 'name handle image vibes')
    .populate('userB', 'name handle image vibes')
    .sort({ score: -1 })
    .limit(limit)
    .lean();

  return matches.map((m) => {
    const other =
      m.userA._id.toString() === userId.toString() ? m.userB : m.userA;
    return { user: other, score: m.score, commonVibes: m.commonVibes };
  });
}

/**
 * Recompute all matches for a user.
 */
async function refreshMatches(userId) {
  const others = await User.find({ _id: { $ne: userId }, isActive: true });
  const promises = others.map((o) => computeMatch(userId, o._id));
  const results = await Promise.allSettled(promises);
  const computed = results.filter((r) => r.status === 'fulfilled').length;
  return { message: `Matched against ${computed} users`, count: computed };
}

module.exports = { computeMatch, getTopMatches, refreshMatches, jaccardSimilarity, cosineSimilarity5D };
