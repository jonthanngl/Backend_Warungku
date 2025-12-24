const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer'); // Tambahan: Import multer untuk handling error upload

const app = express();

// Import Routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); 

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(morgan('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- ROUTES ---
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);   
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Server WarungKu is Running! 🚀" });
});

// --- GLOBAL ERROR HANDLER ---
// Ini penting agar jika upload gagal (misal file > 5MB), server tidak crash
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Error spesifik Multer (misal: File terlalu besar)
        return res.status(400).json({ message: err.message });
    } else if (err) {
        // Error lainnya
        console.error(err);
        return res.status(500).json({ message: 'Terjadi kesalahan internal server' });
    }
    next();
});

module.exports = app;
