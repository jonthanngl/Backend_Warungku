const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); 

// USER ROUTES
router.post('/', orderController.createOrder);
router.get('/:transaction_code', orderController.getOrderStatus);

// ADMIN ROUTES
router.get('/', protect, adminOnly, orderController.getAllOrders);     
router.put('/:id', protect, adminOnly, orderController.updateOrderStatus); 

module.exports = router;
