const mongoose = require('mongoose');

/**
 * Stores computed match scores between user pairs.
 * The similarityAlgorithm field records which algorithm was used.
 */
const VibeMatchSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // 0–100 similarity score
    score: { type: Number, required: true },
    // Which common vibes drove this match
    commonVibes: { type: [String], default: [] },
    algorithm: { type: String, default: 'jaccard' },
  },
  { timestamps: true }
);

// Ensure we only store one record per pair (userA < userB by convention)
VibeMatchSchema.index({ userA: 1, userB: 1 }, { unique: true });
VibeMatchSchema.index({ score: -1 });

module.exports = mongoose.model('VibeMatch', VibeMatchSchema);
