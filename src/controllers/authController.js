const pool = require('../config/db').pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', 
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword, phone_number, 'user']
    );

    const user = newUser.rows[0];

    res.status(201).json({
      message: 'Registrasi berhasil',
      token: generateToken(user.id), 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone_number, // Ditambahkan agar frontend bisa menyimpan nomor HP
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Email tidak ditemukan' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        message: 'Login berhasil',
        token: generateToken(user.id), 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone_number, // Ditambahkan agar frontend bisa menampilkan nomor HP
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
