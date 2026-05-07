const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { authMiddleware, restrictTo } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.use(restrictTo('PARENT'));

router.get('/children', parentController.getChildren);
router.get('/children/:id/activity', parentController.getChildActivity);
router.post('/link-child', parentController.linkChild);

module.exports = router;
