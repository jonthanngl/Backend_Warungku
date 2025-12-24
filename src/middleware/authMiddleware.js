const jwt = require('jsonwebtoken');

// 1. FUNGSI UTAMA: MEMPROTEKSI ROUTE DARI YANG TIDAK PUNYA TOKEN
const protect = (req, res, next) => {
    let token;

    // Cek di header, harusnya formatnya: "Authorization: Bearer <TOKEN>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Simpan info user (id & role) ke objek request
        req.user = decoded; 
        
        next(); // Lanjut ke controller
    } catch (error) {
        // Jika token tidak valid (expired/palsu)
        res.status(401).json({ message: 'Token tidak valid.' });
    }
};

// 2. FUNGSI TAMBAHAN: HANYA UNTUK ADMIN
const adminOnly = (req, res, next) => {
    // req.user sudah ada karena melewati fungsi protect di atas
    if (req.user && req.user.role === 'admin') {
        next(); // Lanjut ke controller
    } else {
        res.status(403).json({ message: 'Akses ditolak. Khusus Admin.' });
    }
};


module.exports = { protect, adminOnly };