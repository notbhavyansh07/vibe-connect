const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const vibeController = require('../controllers/vibe.controller');

/**
 * Vibe matching routes (all protected)
 * GET    /api/vibe/matches       – get top vibe matches
 * GET    /api/vibe/my-vibes      – get current user's vibes
 * PATCH  /api/vibe/update        – update vibes & refresh matches
 * POST   /api/vibe/refresh       – recompute all matches
 * GET    /api/vibe/match/:userId – compute match with specific user
 */
router.use(protect);

router.get('/matches', vibeController.getTopMatches);
router.get('/my-vibes', vibeController.getMyVibes);
router.patch('/update', vibeController.updateVibes);
router.post('/refresh', vibeController.refreshMatches);
router.get('/match/:userId', vibeController.computeMatch);

module.exports = router;
