require('dotenv').config(); // Load .env
const app = require('./src/app');
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server jalan di http://localhost:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});