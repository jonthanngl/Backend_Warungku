// src/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Cek koneksi pas awal jalan
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error connecting to database (Neon):', err.stack);
  }
  console.log('✅ Connected to Neon PostgreSQL successfully!');
  release();
});

module.exports = {
  // WAJIB export POOL dan QUERY agar terbaca oleh Controller
  query: (text, params) => pool.query(text, params),
  pool 
};