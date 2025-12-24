// --- 1. USER: BUAT PESANAN BARU ---
const createOrder = async (req, res) => {
    // Pastikan user sudah login (dari middleware protect)
    const userIdFromToken = req.user.id; 
    
    // Kita TIDAK mengambil total_price dari frontend demi keamanan
    const { 
        customer_name, 
        customer_whatsapp, 
        customer_address, 
        cart_items 
    } = req.body;
    
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Generate kode transaksi
        const timestamp = Date.now().toString().slice(-6);
        const randomNum = Math.floor(Math.random() * 1000);
        const transaction_code = `WRG-${timestamp}-${randomNum}`;
        
        // 2. Buat Order Awal (Total harga 0 dulu, nanti diupdate)
        const orderQuery = `
            INSERT INTO orders (user_id, transaction_code, customer_name, customer_whatsapp, customer_address, total_price, status)
            VALUES ($1, $2, $3, $4, $5, 0, 'Menunggu Konfirmasi')
            RETURNING id, transaction_code
        `;
        
        const orderResult = await client.query(orderQuery, [
            userIdFromToken, 
            transaction_code, 
            customer_name, 
            customer_whatsapp, 
            customer_address
        ]);
        
        const newOrderId = orderResult.rows[0].id;
        
        // 3. Proses Item & Hitung Total Harga Asli dari Database
        let calculatedTotal = 0;
        const itemQuery = `INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)`;
        
        for (const item of cart_items) {
            // Ambil harga asli dari tabel products
            const productRes = await client.query('SELECT price, name FROM products WHERE id = $1', [item.id]);
            
            if (productRes.rows.length === 0) {
                throw new Error(`Produk dengan ID ${item.id} tidak ditemukan`);
            }

            const realPrice = parseInt(productRes.rows[0].price);
            const subtotal = realPrice * item.qty;
            calculatedTotal += subtotal;

            // Masukkan ke order_items
            await client.query(itemQuery, [newOrderId, item.id, item.qty, realPrice]);
        }
        
        // 4. Update Total Harga di Tabel Orders
        await client.query('UPDATE orders SET total_price = $1 WHERE id = $2', [calculatedTotal, newOrderId]);
        
        await client.query('COMMIT');
        
        res.status(201).json({ 
            message: 'Pesanan berhasil dibuat!', 
            transaction_code: transaction_code, 
            total_price: calculatedTotal 
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error Create Order:", err);
        res.status(500).json({ message: 'Gagal memproses pesanan', error: err.message });
    } finally {
        client.release();
    }
};
