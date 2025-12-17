const { pool } = require('../config/db'); 
const getAllMenu = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ ERROR getAllMenu:', err.message);
    res.status(500).json({ message: "Gagal mengambil data menu.", error: err.message });
  }
};

const addMenu = async (req, res) => {

  console.log("📥 Request Masuk ke addMenu");
  console.log("📝 Body:", req.body);
  console.log("📂 File:", req.file); 

  const { name, category, price, description } = req.body;
  
  const image_url = req.file ? req.file.path : null;
  
  if (!price) {
      return res.status(400).json({ message: "Harga (price) menu wajib diisi." });
  }

  try {
    const query = `
      INSERT INTO products (name, category, price, description, image_url, is_available)
      VALUES ($1, $2, $3, $4, $5, true) RETURNING *
    `;
    
    const result = await pool.query(query, [name, category, price, description, image_url]);
    
    console.log("✅ Berhasil Simpan ke DB:", result.rows[0]);
    res.status(201).json({ message: 'Menu berhasil ditambahkan!', data: result.rows[0] });

  } catch (err) {
  
    console.error('❌ ERROR DETAIL (STRING):', JSON.stringify(err, null, 2));
    console.error('❌ ERROR MESSAGE:', err.message);

    res.status(500).json({ 
        message: "Gagal menambahkan menu. Cek terminal backend untuk detail error.",
        error_detail: err.message,
        full_error: JSON.stringify(err)
    });
  }
};

const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, is_available } = req.body;

  console.log(`📥 Request Update Menu ID: ${id}`);
  if (req.file) console.log("📂 Ada File Baru:", req.file.path);

  try {
    let query;
    let values;

    if (req.file) {

        query = `
          UPDATE products 
          SET name = $1, category = $2, price = $3, description = $4, is_available = $5, image_url = $6
          WHERE id = $7
          RETURNING *
        `;
        values = [name, category, price, description, is_available, req.file.path, id];
    } else {

        query = `
          UPDATE products 
          SET name = $1, category = $2, price = $3, description = $4, is_available = $5
          WHERE id = $6
          RETURNING *
        `;
        values = [name, category, price, description, is_available, id];
    }
    
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    console.log("✅ Berhasil Update:", result.rows[0]);
    res.json({ message: 'Menu berhasil diupdate!', data: result.rows[0] });

  } catch (err) {
    console.error('❌ ERROR DI updateMenu:', JSON.stringify(err, null, 2));
    res.status(500).json({ message: "Gagal mengupdate menu.", error: err.message });
  }
};

const deleteMenu = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan' });
    }

    console.log("✅ Berhasil Hapus Menu ID:", id);
    res.json({ message: 'Menu berhasil dihapus!' });

  } catch (err) {
    console.error('❌ ERROR DI deleteMenu:', err.message);
    res.status(500).json({ message: "Gagal menghapus menu.", error: err.message });
  }
};

module.exports = { getAllMenu, addMenu, updateMenu, deleteMenu };
