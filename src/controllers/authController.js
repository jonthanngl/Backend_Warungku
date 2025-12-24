const pool = require('../config/db').pool;
const bcrypt = require('bcryptjs'); // <--- SUDAH DIGANTI JADI BCRYPTJS
const jwt = require('jsonwebtoken');

// --- 1. FUNGSI LOGIN ---
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email tidak ditemukan' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    // BUAT TOKEN JWT
    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    // Kirim data dan TOKEN
    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone_number: user.phone_number 
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- 2. FUNGSI REGISTER ---
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  
  const saltRounds = 10;

  try {
    const checkEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah digunakan!' });
    }
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (name, email, password, phone_number, role)
      VALUES ($1, $2, $3, $4, 'user')
      RETURNING id, name, email, role, phone_number
    `;
    
    const result = await pool.query(query, [name, email, hashedPassword, phone]);
    const newUser = result.rows[0];

    res.status(201).json({
      message: 'Registrasi berhasil! Silakan login.',
      user: newUser
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SAMAKAN EXPORT DENGAN YANG DI ROUTE
const registerUser = register;
const loginUser = login;

module.exports = { registerUser, loginUser, login, register };
