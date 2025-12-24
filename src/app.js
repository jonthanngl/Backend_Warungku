const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');

const app = express();

// Import Routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); 

// --- 1. MIDDLEWARE CORS (DIPERBAIKI) ---
// Ini penting agar Frontend (localhost) bisa bicara dengan Backend (Vercel)
app.use(cors({
  origin: true, // Izinkan semua origin (praktis untuk debug)
  credentials: true, // Izinkan kirim token/cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// --- 2. GLOBAL ERROR HANDLER (DIPERBAIKI) ---
// Agar kalau ada error, server tidak diam saja tapi memberi info detail
app.use((err, req, res, next) => {
    console.error("❌ SERVER ERROR LOG:", err); // Ini akan muncul di Vercel Logs

    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    } 
    
    // Kirim status 500 beserta pesan errornya agar kita tahu penyebabnya
    res.status(500).json({ 
        message: 'Terjadi kesalahan internal server', 
        error_detail: err.message 
    });
});

module.exports = app;
