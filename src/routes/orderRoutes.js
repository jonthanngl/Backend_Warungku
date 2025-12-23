const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Buat pesanan (Harus Login)
router.post('/', protect, orderController.createOrder);

// Ambil riwayat (Harus Login)
router.get('/history', protect, orderController.getUserOrders);

// Track pesanan (Bisa tanpa login)
router.get('/track/:transaction_code', orderController.getOrderStatus);

module.exports = router;
