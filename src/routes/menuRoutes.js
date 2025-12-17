const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/authMiddleware'); 
const upload = require('../middleware/uploadMiddleware'); 

router.get('/', menuController.getAllMenu); 


// --- PROTEKSI ROUTE ADMIN (Hanya Admin yang bisa akses) ---
router.post('/', protect, adminOnly, upload.single('image'), menuController.addMenu); 

router.put('/:id', protect, adminOnly, upload.single('image'), menuController.updateMenu);    

router.delete('/:id', protect, adminOnly, menuController.deleteMenu); 

module.exports = router;

