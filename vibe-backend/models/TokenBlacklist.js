const mongoose = require('mongoose');

/**
 * TokenBlacklist – stores invalidated access tokens for logout.
 * TTL index auto-deletes after token expiry.
 */
const schema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false }
);

// Auto-expire entries when the token naturally expires
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TokenBlacklist', schema);