const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/dashboard', studentController.getDashboardData);
router.get('/lessons', studentController.getLessons);
router.post('/lessons/:id/progress', studentController.updateProgress);
router.get('/practice', studentController.getPracticeQuestions);
router.post('/exam/start', studentController.startExamSession);
router.post('/exam/finish', studentController.finishExamSession);
router.get('/test', (req, res) => res.json({ msg: 'Student routes are active' }));
router.get('/leaderboard', studentController.getLeaderboard);

module.exports = router;
