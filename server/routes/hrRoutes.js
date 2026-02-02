const express = require('express');
const hrController = require('../controllers/hrController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/search', protect, authorize('hr'), hrController.searchCandidates);
router.delete('/candidate/:id', protect, authorize('hr'), hrController.deleteCandidate);
router.put('/candidate/:id', protect, authorize('hr'), hrController.updateCandidate);
router.post('/reset', protect, authorize('hr'), hrController.resetCandidates);

module.exports = router;
