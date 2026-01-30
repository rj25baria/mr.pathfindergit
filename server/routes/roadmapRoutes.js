const express = require('express');
const { generateRoadmap, getRoadmaps, updateProgress, validatePhaseQuiz } = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/generate', protect, generateRoadmap);
router.get('/my-roadmap', protect, getRoadmaps);
router.put('/progress', protect, updateProgress);
router.post('/validate-quiz', protect, validatePhaseQuiz);

module.exports = router;
