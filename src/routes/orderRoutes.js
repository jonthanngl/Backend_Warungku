const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

// --- USER ROUTES ---

router.post('/', orderController.createOrder);

// 1. Route History (Harus paling atas sebelum yg pakai :param)
router.get('/history', protect, orderController.getUserOrders);

// 2. Route Tracking (Saya tambah /track/ biar spesifik dan tidak bentrok)
router.get('/track/:transaction_code', orderController.getOrderStatus);

// --- ADMIN ROUTES ---
router.get('/', protect, adminOnly, orderController.getAllOrders);     
router.put('/:id', protect, adminOnly, orderController.updateOrderStatus); 

module.exports = router;
