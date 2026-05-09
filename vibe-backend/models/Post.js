const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  // Media uploaded via Cloudinary
  media: {
    url: { type: String },
    publicId: { type: String },
    type: { type: String, enum: ['image', 'video', null] },
  },
  // Optional vibe tag for matching
  tag: { type: String, trim: true },
  // Stats counters – updated atomically
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  // Recommendation score (updated by AI service)
  recommendationScore: { type: Number, default: 0 },
  // Soft delete
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

PostSchema.index({ createdAt: -1 });
PostSchema.index({ authorId: 1, createdAt: -1 });
PostSchema.index({ tag: 1, createdAt: -1 });
PostSchema.index({ recommendationScore: -1 });

module.exports = mongoose.model('Post', PostSchema);
