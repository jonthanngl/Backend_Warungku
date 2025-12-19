const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

// USER ROUTES
router.post('/', orderController.createOrder);

// --- RUTE BARU: RIWAYAT PESANAN (Harus diletakkan DI ATAS route /:transaction_code) ---
router.get('/history', protect, orderController.getUserOrders);

// Route untuk Lacak Pesanan (Saya tambahkan prefix /track/ biar aman & tidak bentrok)
router.get('/track/:transaction_code', orderController.getOrderStatus);
// Jaga-jaga kalau frontend masih pakai route lama (tanpa /track/), biarkan yg ini di paling bawah:
router.get('/:transaction_code', orderController.getOrderStatus);

// ADMIN ROUTES
router.get('/', protect, adminOnly, orderController.getAllOrders);     
router.put('/:id', protect, adminOnly, orderController.updateOrderStatus); 

module.exports = router;
