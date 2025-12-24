// src/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'warung-fix-menu',
    // PASTIKAN 'avif' ADA DI SINI 👇
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'], 
  },
});

module.exports = { cloudinary, storage };