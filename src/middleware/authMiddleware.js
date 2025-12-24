const jwt = require('jsonwebtoken');
const pool = require('../config/db').pool;

// Middleware 1: Cek Token (Login gak?)
const protect = async (req, res, next) => {
  let token;

  // Cek header Authorization: "Bearer asdfghjkl..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil tokennya saja (buang kata 'Bearer ')
      token = req.headers.authorization.split(' ')[1];

      // Verifikasi Token pakai JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Cari user pemilik token ini di DB (tanpa password)
      const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [decoded.id]);
      
      if (result.rows.length === 0) {
        throw new Error('User tidak ditemukan');
      }

      // Tempel data user ke request supaya bisa dipakai di controller
      req.user = result.rows[0];

      next(); // Lanjut ke controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Token tidak valid, otorisasi gagal' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Tidak ada token, akses ditolak' });
  }
};

// Middleware 2: Cek Admin (Khusus Route Admin)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Akses ditolak, khusus Admin!' });
  }
};

module.exports = { protect, adminOnly };