const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { getUploader } = require('../utils/upload');
const { createPostSchema } = require('../middleware/validators/post.validation');
const postController = require('../controllers/post.controller');

const upload = getUploader('vibe-connect/posts');

// Public routes
router.get('/', postController.getFeed);          // GET /api/posts?sort=newest&page=1&tag=x
router.get('/trending', postController.getTrending);
router.get('/search', postController.search);
router.get('/personalized', protect, postController.personalizedFeed);
router.get('/:id', postController.getById);

// Protected routes
router.post('/', protect, upload.single('media'), validate(createPostSchema), postController.create);
router.delete('/:id', protect, postController.delete);

// Likes (requires auth to toggle)
router.post('/:postId/like', protect, postController.toggleLike);
router.get('/:postId/like', protect, postController.getLikeStatus);
router.get('/:postId/likes', postController.getAllLikes);

// Comments
router.post('/:postId/comments', protect, postController.addComment);
router.get('/:postId/comments', postController.getComments);

module.exports = router;
