const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { updateProfileSchema } = require('../middleware/validators/user.validation');
const userController = require('../controllers/user.controller');

/**
 * User routes
 * GET    /api/users              – list all users (public)
 * GET    /api/users/recommended  – get recommended users (protected)
 * GET    /api/users/:handle      – get user profile by handle (public)
 * PATCH  /api/users/profile      – update own profile (protected)
 * POST   /api/users/follow       – follow/unfollow (protected)
 * GET    /api/users/:userId/followers  (public)
 * GET    /api/users/:userId/following  (public)
 * GET    /api/users/:userId/follow-status (protected)
 */
router.get('/recommended', protect, userController.getRecommended);
router.get('/', userController.list);
router.get('/:handle', userController.getProfile);
router.patch('/profile', protect, validate(updateProfileSchema), userController.updateProfile);
router.post('/follow', protect, userController.follow);
router.get('/:userId/follow-status', protect, userController.getFollowStatus);
router.get('/:userId/followers', userController.getFollowers);
router.get('/:userId/following', userController.getFollowing);

module.exports = router;
