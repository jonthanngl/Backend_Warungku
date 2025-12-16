const pool = require('../config/db').pool; // Pastikan path db kamu benar

const getAllMenu = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addMenu = async (req, res) => {
  const { name, category, price, description } = req.body;

  const image_url = req.file ? req.file.path : null;
  
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

const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, is_available } = req.body;

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

    res.json({ message: 'Menu berhasil diupdate!', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

