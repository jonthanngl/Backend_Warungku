const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware'); // Pastikan ini diimport

// Route untuk membuat pesanan baru (WAJIB pakai protect)
router.post('/', protect, orderController.createOrder); // Tambahkan protect di sini

// Route untuk mengambil riwayat pesanan user
router.get('/history', protect, orderController.getUserOrders); // Ini sudah benar

// Route untuk tracking pesanan berdasarkan kode
router.get('/track/:code', orderController.trackOrder);

module.exports = router;
