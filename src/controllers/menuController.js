const pool = require('../config/db').pool; // Sesuaikan path db kamu

// 1. AMBIL SEMUA MENU
const getAllMenu = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. TAMBAH MENU BARU
const addMenu = async (req, res) => {
  const { name, category, price, description } = req.body;
 const image_url = req.file ? `/uploads/${req.file.filename}` : null;
 
  try {
    const query = `
      INSERT INTO products (name, category, price, description, image_url, is_available)
      VALUES ($1, $2, $3, $4, $5, true) RETURNING *
    `;
    const result = await pool.query(query, [name, category, price, description, image_url]);
    res.status(201).json({ message: 'Menu berhasil ditambahkan!', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. EDIT MENU (UBAH STATUS / HARGA) <--- INI BARU
const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, is_available } = req.body;

  try {
    // Kita update data berdasarkan ID
    const query = `
      UPDATE products 
      SET name = $1, category = $2, price = $3, description = $4, is_available = $5
      WHERE id = $6
      RETURNING *
    `;
    const values = [name, category, price, description, is_available, id];
    
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    res.json({ message: 'Menu berhasil diupdate!', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. HAPUS MENU <--- INI BARU
const deleteMenu = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    res.json({ message: 'Menu berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllMenu, addMenu, updateMenu, deleteMenu };