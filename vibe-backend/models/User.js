const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  // null for Google OAuth users who have no password
  password: { type: String },
  handle: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  image: { type: String },
  coverImage: { type: String },
  bio: { type: String, maxlength: 300, default: '' },
  // comma-separated interest/vibe tags
  vibes: { type: [String], default: [] },
  color: { type: String, default: 'bg-primary' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // Vibe score – calculated from activity, followers, post quality
  vibeScore: { type: Number, default: 1000 },
  // OAuth provider info
  oauthProvider: { type: String, enum: [null, 'google'] },
  oauthId: { type: String },
  // Refresh token stored for rotation
  refreshToken: { type: String },
  // Soft delete
  isActive: { type: Boolean, default: true },
  // Stats (cached counters for fast reads)
  followerCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },
  postCount: { type: Number, default: 0 },
}, { timestamps: true });

// Computed virtual field – never stored
UserSchema.virtual('profileUrl').get(function () {
  return this.handle ? `/users/${this.handle}` : `/users/${this._id}`;
});

// Ensure at least one identity field is present – email, handle, or oauthId
UserSchema.pre('validate', function () {
  if (!this.email && !this.oauthId) {
    this.invalidate('email', 'Email or OAuth ID is required');
  }
  // Auto-generate handle from email/username
  if (this.isModified('name') && !this.handle) {
    this.handle = this.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2, 7);
  }
});

module.exports = mongoose.model('User', UserSchema);
