const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/initialize', authMiddleware, paymentController.initializePayment);
router.get('/verify', paymentController.verifyPayment);
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
