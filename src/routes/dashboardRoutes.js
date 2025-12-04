const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

// Rute untuk mengambil ringkasan penjualan
router.get('/sales', protect, adminOnly, dashboardController.getSalesSummary);

module.exports = router;