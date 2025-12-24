# WarungKu Backend API
Repositori ini berisi kode sumber untuk server API WarungKu, sebuah platform pemesanan makanan. Backend ini dibangun menggunakan Node.js dan Express, serta menggunakan MongoDB sebagai basis data untuk mengelola pengguna, menu, dan transaksi pesanan.

# 🛠️ Arsitektur & Teknologi
Runtime: Node.js.

Framework: Express.js.

Database: MongoDB melalui Mongoose.

Autentikasi: JSON Web Token (JWT) untuk pengamanan endpoint.

Penyimpanan Gambar: Cloudinary API untuk mengunggah dan menyimpan foto menu.

Middleware: cors untuk akses lintas domain, multer untuk penanganan file, dan custom middleware untuk proteksi rute.

# 📁 Struktur Proyek
src/config/: Konfigurasi basis data (MongoDB) dan layanan pihak ketiga (Cloudinary).

src/controllers/: Logika bisnis utama untuk autentikasi, manajemen menu, pesanan, dan dashboard.

src/routes/: Definisi endpoint API yang dikelompokkan berdasarkan fungsi.

src/middleware/: Validasi token JWT dan pengaturan unggah file.

index.js / src/app.js: Titik masuk utama aplikasi dan konfigurasi server.

# 🚀 Endpoint API Utama
Berikut adalah beberapa rute utama yang tersedia:

1. Autentikasi (/api/auth)
POST /register: Mendaftarkan pengguna baru.

POST /login: Masuk ke sistem dan mendapatkan token JWT.

2. Menu (/api/menu)
GET /: Mengambil semua daftar menu.

POST /: Menambahkan menu baru (khusus Admin, mendukung unggah gambar).

PUT /:id: Memperbarui data menu.

DELETE /:id: Menghapus menu dari sistem.

3. Pesanan (/api/orders)
POST /: Membuat pesanan baru.

GET /user: Melihat riwayat pesanan pengguna yang sedang login.

PATCH /:id/status: Memperbarui status pesanan (khusus Admin).

4. Dashboard (/api/dashboard)
GET /stats: Mendapatkan ringkasan statistik untuk panel Admin.

# 🔐 Keamanan
Aplikasi ini menggunakan middleware protect untuk memastikan bahwa hanya pengguna dengan token valid yang dapat melakukan pemesanan, dan middleware admin untuk membatasi akses ke fungsi manajemen menu dan statistik dashboard.
