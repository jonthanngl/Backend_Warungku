const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

// 1. Buat pesanan (User Login)
router.post('/', protect, orderController.createOrder);

// 2. Ambil riwayat pesanan sendiri (User Login) <-- INI WAJIB ADA
router.get('/history', protect, orderController.getUserOrders);

// 3. Track pesanan (Umum/Tanpa Login)
router.get('/track/:transaction_code', orderController.getOrderStatus);

// 4. Ambil SEMUA pesanan (KHUSUS ADMIN)
router.get('/', protect, adminOnly, orderController.getAllOrders);

// 5. Update Status Pesanan (KHUSUS ADMIN)
router.put('/:id', protect, adminOnly, orderController.updateOrderStatus);

module.exports = router;
