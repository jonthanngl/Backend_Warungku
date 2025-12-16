const multer = require('multer');
// Kita import 'storage' yang sudah dibuat di file config cloudinary
const { storage } = require('../config/cloudinary'); 

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Opsional: Batas ukuran file (contoh: 5MB)
});

module.exports = upload;
