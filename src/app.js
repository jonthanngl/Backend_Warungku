const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Import Routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes'); 
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // <-- BARU

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(morgan('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads'))); 

// --- ROUTES ---
app.use('/api/dashboard', dashboardRoutes); // <-- BARU
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);   
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: "Server WarungKu is Running! 🚀" });
});

module.exports = app;
