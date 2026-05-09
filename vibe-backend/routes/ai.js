const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const vibeController = require('../controllers/vibe.controller');

/**
 * AI recommendation routes (vibe avatar, text enhancement, hashtag gen, song rec, popular tags)
 */
router.post('/enhance', aiController.enhanceVibe);
router.post('/hashtags-gen', aiController.generateHashtags);
router.post('/analyze-voice', aiController.analyzeVoiceTone);
router.post('/narrate', aiController.getNarratorVoice);
router.get('/song', aiController.getSongRecommendation);
router.get('/hashtags', aiController.getPopularHashtags);
router.get('/vibe-avatar', aiController.getVibeAvatarPrompt);

module.exports = router;
