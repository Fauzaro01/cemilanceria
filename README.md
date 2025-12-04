# 🍪 CemilanCeria — E-Commerce Platform

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4.x-blue?style=for-the-badge&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
</div>

<p align="center">
  <strong>Platform E-Commerce Modern untuk Penjualan Cemilan Online</strong>
</p>

CemilanCeria adalah aplikasi e-commerce full-stack yang dirancang khusus untuk penjualan cemilan dan makanan ringan secara online. Platform ini menyediakan pengalaman berbelanja yang seamless dengan fitur manajemen toko yang lengkap.

---

## 📋 Daftar Isi
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi-yang-digunakan)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Project](#-struktur-project)
- [API Documentation](#-api-documentation)
- [Kontribusi](#-kontribusi)
- [Tim Pengembang](#-tim-pengembang)
- [Lisensi](#-lisensi)

---

## ✨ Fitur Utama

### 🛍️ Fitur Customer
- **Katalog Produk** - Tampilan produk yang menarik dengan filter dan pencarian
- **Keranjang Belanja** - Manajemen keranjang dengan update real-time
- **Checkout & Payment** - Integrasi payment gateway (Midtrans)
- **Order Tracking** - Lacak status pesanan secara real-time
- **User Profile** - Kelola profil dan riwayat pembelian
- **Wishlist** - Simpan produk favorit untuk pembelian nanti

### 👨‍💼 Fitur Admin
- **Dashboard Analytics** - Statistik penjualan dan performa toko
- **Manajemen Produk** - CRUD produk dengan upload gambar
- **Manajemen Pesanan** - Kelola dan update status pesanan
- **Manajemen User** - Kelola data pelanggan dan admin
- **Laporan Transaksi** - Generate laporan penjualan mingguan/bulanan
- **Export Data** - Export laporan ke format CSV/Excel

### 🔐 Fitur Keamanan
- **Autentikasi & Otorisasi** - Login dengan Passport.js
- **Role-Based Access Control** - Pemisahan akses admin dan user
- **Session Management** - Sesi pengguna yang aman
- **Password Encryption** - Enkripsi password dengan bcrypt

---

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **Prisma ORM** - Database ORM untuk PostgreSQL/MySQL
- **Passport.js** - Authentication middleware
- **Express Session** - Session management

### Frontend
- **EJS** - Template engine
- **TailwindCSS** - Utility-first CSS framework
- **Chart.js** - Data visualization
- **SweetAlert2** - Beautiful alerts and modals
- **Font Awesome** - Icon library

### Payment Gateway
- **Midtrans** - Payment gateway integration

### Database
- **PostgreSQL** / **MySQL** - Relational database

---

## 📦 Prasyarat

Sebelum memulai instalasi, pastikan sistem Anda telah memiliki:

- **Node.js** v18.x atau lebih tinggi ([Download](https://nodejs.org/))
- **npm** v9.x atau lebih tinggi (terinstal dengan Node.js)
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL** atau **MySQL** database server
- **Text Editor** (VS Code recommended)

---

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/Fauzaro01/cemilanceria.git
cd cemilanceria
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database dengan Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migrasi database
npx prisma migrate dev

# (Optional) Seed database dengan data awal
npx prisma db seed
```

---

## ⚙️ Konfigurasi

### 1. Environment Variables
Buat file `.env` di root project dan konfigurasi variabel berikut:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/cemilanceria"
# Atau untuk MySQL:
# DATABASE_URL="mysql://username:password@localhost:3306/cemilanceria"

# Server Configuration
PORT=3000
NODE_ENV=development

# Session Secret
SESSION_SECRET="your-super-secret-key-here-change-in-production"

# Midtrans Configuration (Payment Gateway)
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION=false

# Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH="./public/img/uploads"
```

### 2. Konfigurasi Database
Sesuaikan `DATABASE_URL` dengan kredensial database Anda:
- **PostgreSQL**: `postgresql://user:password@localhost:5432/dbname`
- **MySQL**: `mysql://user:password@localhost:3306/dbname`

### 3. Konfigurasi Midtrans
Dapatkan API keys dari [Midtrans Dashboard](https://dashboard.midtrans.com/):
1. Register/Login ke Midtrans
2. Pilih environment (Sandbox untuk development)
3. Copy Server Key dan Client Key
4. Paste ke file `.env`

---

## 🎯 Menjalankan Aplikasi

### Development Mode

Jalankan dua terminal secara bersamaan:

**Terminal 1 - Development Server:**
```bash
npm run dev
```

**Terminal 2 - Tailwind CSS Compiler:**
```bash
npm run tailwind
```

Aplikasi akan berjalan di: **http://localhost:3000**

### Production Mode

```bash
# Build Tailwind CSS
npm run build:css

# Start production server
npm start
```

### Prisma Studio (Database GUI)
```bash
npx prisma studio
```
Akses database GUI di: **http://localhost:5555**

---

## 📁 Struktur Project

```
cemilanceria/
├── config/                 # Konfigurasi aplikasi
│   └── passport.js        # Konfigurasi autentikasi
├── middleware/            # Custom middleware
│   └── auth.js           # Authentication middleware
├── prisma/               # Prisma ORM
│   ├── schema.prisma    # Database schema
│   ├── migrations/      # Database migrations
│   └── seed.js         # Database seeder
├── public/              # Static files
│   ├── css/            # Compiled CSS
│   ├── img/            # Images & uploads
│   └── js/             # Client-side JavaScript
├── route/               # Route handlers
│   ├── admin.js        # Admin routes
│   ├── auth.js         # Authentication routes
│   ├── user.js         # User routes
│   └── api/            # API endpoints
│       ├── admin.js    # Admin API
│       ├── product.js  # Product API
│       └── user.js     # User API
├── views/               # EJS templates
│   ├── admin/          # Admin pages
│   ├── user/           # User pages
│   ├── partials/       # Reusable components
│   └── *.ejs           # Public pages
├── .env                 # Environment variables (create this)
├── .gitignore          # Git ignore rules
├── index.js            # Application entry point
├── package.json        # Dependencies & scripts
└── README.md           # Documentation
```

---

## 📚 API Documentation

### Authentication Endpoints
```
POST   /auth/register          # Register new user
POST   /auth/login             # Login user
GET    /auth/logout            # Logout user
```

### Product Endpoints
```
GET    /api/products           # Get all products
GET    /api/products/:id       # Get product by ID
POST   /api/admin/products     # Create product (Admin)
PUT    /api/admin/products/:id # Update product (Admin)
DELETE /api/admin/products/:id # Delete product (Admin)
```

### Order Endpoints
```
GET    /api/orders             # Get user orders
GET    /api/orders/:id         # Get order detail
POST   /api/orders             # Create new order
GET    /api/admin/orders       # Get all orders (Admin)
PUT    /api/admin/orders/:id/status # Update order status (Admin)
```

### Report Endpoints
```
GET    /api/admin/reports/sales       # Get sales report (Admin)
GET    /api/admin/reports/sales/export # Export report CSV (Admin)
```

---

## 🤝 Kontribusi

Kami sangat terbuka untuk kontribusi dari siapa saja! Berikut panduan untuk berkontribusi:

### Langkah-langkah Kontribusi

1. **Fork repository ini**
2. **Buat branch baru** untuk fitur/fix Anda:
   ```bash
   git checkout -b feat/nama-fitur
   # atau
   git checkout -b fix/nama-bug
   ```
3. **Commit perubahan** Anda dengan pesan yang jelas:
   ```bash
   git commit -m "feat: menambahkan fitur X"
   # atau
   git commit -m "fix: memperbaiki bug Y"
   ```
4. **Push ke branch** Anda:
   ```bash
   git push origin feat/nama-fitur
   ```
5. **Buat Pull Request** di GitHub

### Commit Message Convention
Gunakan format commit message yang jelas:
- `feat:` untuk fitur baru
- `fix:` untuk bug fix
- `docs:` untuk perubahan dokumentasi
- `style:` untuk perubahan formatting
- `refactor:` untuk refactoring code
- `test:` untuk menambah/update test
- `chore:` untuk maintenance tasks

---

## 👥 Tim Pengembang

Proyek ini dikembangkan oleh tim yang berdedikasi:

- **Adrian Maulana Rahman** - Backend Developer
- **Ahmad Kin Hirufael** - Frontend Developer
- **Bartholomeus Immanuel Zebian K** - Frontend Developer
- **Dimas Bagus P** - Frontend Developer
- **Maulana Rivqi** - Backend Developer
- **Muhamad Fauzaan** - Full Stack Developer
- **Fahreza Mustafiq** - Frontend Developer
- **Salman Yusuf Alfarisi** - Frontend Developer

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

---

## 📞 Kontak & Support

- **GitHub Issues**: [Report Bug](https://github.com/Fauzaro01/cemilanceria/issues)
- **Email**: cemilanceeria@gmail.com
- **Documentation**: [Wiki](https://github.com/Fauzaro01/cemilanceria/wiki)

---

## 🙏 Acknowledgments

Terima kasih kepada:
- Semua kontributor yang telah membantu mengembangkan project ini
- Open source community atas library dan tools yang amazing
- Dosen pembimbing atas guidance dan support

---

<div align="center">
  <p>Made with ❤️ by CemilanCeria Team</p>
  <p>⭐ Star repository ini jika Anda merasa terbantu!</p>
</div>
