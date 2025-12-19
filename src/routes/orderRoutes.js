const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

// --- USER ROUTES ---

// 1. Buat Pesanan
router.post('/', orderController.createOrder);

// 2. Riwayat Pesanan User (PENTING: Taruh di atas route :transaction_code)
router.get('/history', protect, orderController.getUserOrders);

// 3. Lacak Pesanan (Tambahkan /track/ agar spesifik)
router.get('/track/:transaction_code', orderController.getOrderStatus);

// --- ADMIN ROUTES ---
router.get('/', protect, adminOnly, orderController.getAllOrders);     
router.put('/:id', protect, adminOnly, orderController.updateOrderStatus); 

module.exports = router;
