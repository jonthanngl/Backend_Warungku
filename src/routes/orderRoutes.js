const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); // Pastikan adminOnly di-import

// 1. Buat pesanan (User Login)
router.post('/', protect, orderController.createOrder);

// 2. Ambil SEMUA pesanan (KHUSUS ADMIN) <--- INI YANG HILANG SEBELUMNYA
// AdminPage memanggil GET /api/orders, jadi route ini WAJIB ada
router.get('/', protect, adminOnly, orderController.getAllOrders);

// 3. Ambil riwayat pesanan sendiri (User Login)
router.get('/history', protect, orderController.getUserOrders);

// 4. Track pesanan (Umum/Tanpa Login)
router.get('/track/:transaction_code', orderController.getOrderStatus);

// 5. Update Status Pesanan (KHUSUS ADMIN)
router.put('/:id', protect, adminOnly, orderController.updateOrderStatus);

module.exports = router;
