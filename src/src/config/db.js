// src/config/database.js
// src/config/database.js
const { Pool } = require('pg');

// Gunakan DATABASE_URL jika tersedia (untuk deployment)
const connectionConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Wajib untuk SSL/TLS di Neon
  }
} : {
  // Variabel terpisah untuk pengembangan lokal
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const pool = new Pool(connectionConfig);

// ... (sisa kode tetap sama)

// Cek koneksi pas awal jalan
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to database:', err.stack);
  }
  console.log('Connected to PostgreSQL database successfully!');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};