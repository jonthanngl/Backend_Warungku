const pool = require('../config/db').pool;

const getSalesSummary = async (req, res) => {
    try {
        // Query menghitung Total Pendapatan dan Jumlah Pesanan Selesai
        const totalRevenueQuery = `
            SELECT 
                COALESCE(SUM(total_price), 0) AS total_revenue,
                COUNT(id) AS total_orders
            FROM orders
            WHERE status = 'Selesai';
        `;
        const revenueResult = await pool.query(totalRevenueQuery);
        const { total_revenue, total_orders } = revenueResult.rows[0];

        // Query untuk menghitung pendapatan per hari dalam 7 hari terakhir
        // Penting: COALESCE(SUM(total_price), 0) digunakan agar hasilnya 0 jika tidak ada penjualan
        const dailyRevenueQuery = `
            SELECT 
                DATE(created_at) AS date,
                COALESCE(SUM(total_price), 0) AS revenue
            FROM orders
            WHERE status = 'Selesai' AND created_at >= NOW() - INTERVAL '7 days'
            GROUP BY date
            ORDER BY date;
        `;
        const dailyRevenueResult = await pool.query(dailyRevenueQuery);

        res.json({
            total_sales: parseFloat(total_revenue).toFixed(2),
            total_completed_orders: parseInt(total_orders),
            daily_data: dailyRevenueResult.rows.map(row => ({
                date: row.date,
                revenue: parseFloat(row.revenue).toFixed(2)
            }))
        });

    } catch (err) {
        console.error('Error fetching sales summary:', err);
        res.status(500).json({ error: 'Gagal mengambil data ringkasan penjualan' });
    }
};

module.exports = { getSalesSummary };\
