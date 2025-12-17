const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error connecting to database (Neon):', err.stack);
  }
  console.log('✅ Connected to Neon PostgreSQL successfully!');
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool 
};
