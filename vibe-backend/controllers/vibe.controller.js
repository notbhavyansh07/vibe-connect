const { getTopMatches, refreshMatches, computeMatch } = require('../services/vibe.service');
const User = require('../models/User');
const VibeMatch = require('../models/VibeMatch');
const { cacheGet, cacheSet } = require('../config/redis');

/**
 * Vibe matching controller – discover users with similar vibes.
 */

exports.getTopMatches = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const cacheKey = `vibe:matches:${req.user._id}:${limit}`;

    const cached = await cacheGet(cacheKey);
    if (cached) return res.json(cached);

    const matches = await getTopMatches(req.user._id, limit);
    await cacheSet(cacheKey, matches, 600); // 10 min cache
    res.json(matches);
  } catch (err) {
    next(err);
  }
};

exports.computeMatch = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const match = await computeMatch(req.user._id, userId);

    // Notify if score is high enough
    if (match.score >= 60) {
      await require('../models/Notification').create({
        receiverId: userId,
        senderId: req.user._id,
        type: 'vibe_match',
        message: `You and ${req.user.name} have a ${match.score}% vibe match!`,
      });
    }

    res.json(match);
  } catch (err) {
    next(err);
  }
};

exports.refreshMatches = async (req, res, next) => {
  try {
    const result = await refreshMatches(req.user._id);
    await cacheDel(`vibe:matches:${req.user._id}:*`);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.updateVibes = async (req, res, next) => {
  try {
    const { vibes } = req.body;
    if (!vibes || !Array.isArray(vibes)) {
      return res.status(400).json({ message: 'vibes array is required' });
    }

    await User.findByIdAndUpdate(req.user._id, { vibes }, { new: true });

    // Refresh all matches after vibe update
    const result = await refreshMatches(req.user._id);
    await cacheDel(`vibe:matches:${req.user._id}:*`);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getMyVibes = async (req, res) => {
  res.json({ vibes: req.user.vibes, vibeScore: req.user.vibeScore });
};
