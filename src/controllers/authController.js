const pool = require('../config/db').pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fungsi Helper: Bikin Token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token berlaku 30 hari
  });
};

// --- REGISTER ---
const registerUser = async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  try {
    // 1. Cek apakah email sudah ada?
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // 2. Enkripsi Password (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Simpan ke Database (Default role = user)
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword, phone_number, 'user']
    );

    const user = newUser.rows[0];

    // 4. Kirim Respon + TOKEN JWT
    res.status(201).json({
      message: 'Registrasi berhasil',
      token: generateToken(user.id), // <--- INI JWT NYA
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- LOGIN ---
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Cari user berdasarkan email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Email tidak ditemukan' });
    }

    const user = result.rows[0];

    // 2. Cek Password (Bandingkan input dgn hash di DB)
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // 3. Password Cocok -> Kirim TOKEN JWT
      res.json({
        message: 'Login berhasil',
        token: generateToken(user.id), // <--- INI JWT NYA
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(400).json({ message: 'Password salah' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { registerUser, loginUser };
