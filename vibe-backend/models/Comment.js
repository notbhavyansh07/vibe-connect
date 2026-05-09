const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  content: { type: String, required: true, trim: true, maxlength: 1000 },
}, { timestamps: true });

CommentSchema.index({ postId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
