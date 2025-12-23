const pool = require('../config/db').pool;

// --- 1. USER: BUAT PESANAN BARU ---
const createOrder = async (req, res) => {
    // Ambil ID User langsung dari Token (req.user), jangan percaya req.body untuk keamanan
    const userIdFromToken = req.user.id; 
    const { customer_name, customer_whatsapp, customer_address, total_price, cart_items } = req.body;
    
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const timestamp = Date.now().toString().slice(-6);
        const randomNum = Math.floor(Math.random() * 1000);
        const transaction_code = `WRG-${timestamp}-${randomNum}`;
        
        const orderQuery = `
            INSERT INTO orders (user_id, transaction_code, customer_name, customer_whatsapp, customer_address, total_price, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'Menunggu Konfirmasi')
            RETURNING id, transaction_code
        `;
        
        // Menggunakan userIdFromToken agar pesanan terikat ke akun yang login
        const orderResult = await client.query(orderQuery, [
            userIdFromToken, transaction_code, customer_name, customer_whatsapp, customer_address, total_price
        ]);
        const newOrderId = orderResult.rows[0].id;
        
        const itemQuery = `INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)`;
        for (const item of cart_items) {
            await client.query(itemQuery, [newOrderId, item.id, item.qty, item.price]);
        }
        
        await client.query('COMMIT');
        res.status(201).json({ 
            message: 'Pesanan berhasil dibuat!', 
            transaction_code: transaction_code, 
            total_price: total_price 
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Gagal memproses pesanan' });
    } finally {
        client.release();
    }
};

// --- 2. USER: CEK STATUS (TRACKING) ---
const getOrderStatus = async (req, res) => {
    const { transaction_code } = req.params;
    try {
        const orderQuery = `SELECT * FROM orders WHERE transaction_code = $1`;
        const orderResult = await pool.query(orderQuery, [transaction_code]);
        
        if (orderResult.rows.length === 0) {
            return res.status(404).json({ message: 'Kode transaksi tidak ditemukan' });
        }
        
        const order = orderResult.rows[0];
        const itemsQuery = `
            SELECT p.name, oi.quantity 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = $1
        `;
        const itemsResult = await pool.query(itemsQuery, [order.id]);
        const itemsString = itemsResult.rows.map(item => `${item.name} (${item.quantity})`).join(', ');
        
        res.json({
            id: order.transaction_code,
            customer: order.customer_name,
            status: order.status,
            total_price: order.total_price,
            items: itemsString,
            timeline: [
                { status: "Pesanan Dibuat", time: order.created_at, done: true },
                { status: "Diproses Dapur", time: "-", done: order.status !== 'Menunggu Konfirmasi' && order.status !== 'Menunggu Pembayaran' },
                { status: "Selesai", time: "-", done: order.status === 'Selesai' },
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 3. USER: RIWAYAT PESANAN (BARU/DITAMBAHKAN KEMBALI) ---
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; 
        
        const query = `
            SELECT 
                o.id, o.transaction_code, o.customer_name, o.total_price, o.status, o.created_at,
                COALESCE(STRING_AGG(p.name || ' (' || oi.quantity || ')', ', '), 'Tidak ada item') as menu_items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        const result = await pool.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Gagal mengambil riwayat pesanan' });
    }
};

// --- 4. ADMIN: AMBIL SEMUA PESANAN ---
const getAllOrders = async (req, res) => {
    try {
        const query = `
            SELECT 
                o.id, o.transaction_code, o.customer_name, o.total_price, o.status, o.created_at,
                STRING_AGG(p.name || ' (' || oi.quantity || ')', ', ') as menu_items
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- 5. ADMIN: UPDATE STATUS PESANAN ---
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    try {
        const query = `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`;
        const result = await pool.query(query, [status, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
        res.json({ message: 'Status berhasil diperbarui', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// EXPORT SEMUA FUNGSI [Citations: src/controllers/orderController.js]
module.exports = { 
    createOrder, 
    getOrderStatus, 
    getUserOrders, 
    getAllOrders, 
    updateOrderStatus 
};
