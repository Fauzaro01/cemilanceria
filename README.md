# **Cemilanceria - E-Commerce**

Selamat datang di Cemilan Shop! Ini adalah aplikasi e-commerce sederhana untuk membeli Produk secara online. Dibangun menggunakan **Next.js** dan **Tailwind CSS** untuk menciptakan UI yang interaktif dan menarik.

## **Preview Project**

* **Legacy** (HTML,CSS,JS): [CemilanCeria](https://fauzaro01.github.io/cemilanceria)

* **Latest** (NextJS, TailwindCSS): [CemilanCeria](https://cemilanceria.web.app)

## **Fitur**

* **Halaman utama**: Menampilkan daftar produk yang dapat dibeli.
* **Keranjang belanja**: Pengguna dapat menambahkan produk ke keranjang dan melanjutkan ke pemesanan melalui whatsapp.
* **Responsive**: Aplikasi ini responsif di berbagai perangkat menggunakan Tailwind CSS.

## **Prasyarat**

Sebelum memulai, pastikan Anda memiliki hal berikut:

* **Node.js** versi 14 atau lebih baru
* **npm** atau **yarn**

## **Cara Menjalankan Project**

1. Clone repository ini ke dalam folder lokal Anda:

   ```bash
   git clone https://github.com/fauzaro01/cemilanceria.git
   cd cemilanceria
   ```

2. Install dependencies menggunakan npm atau yarn:

   ```bash
   npm install
   # atau
   yarn install
   ```

3. Jalankan project di local server:

   ```bash
   npm run dev
   # atau
   yarn dev
   ```

4. Akses aplikasi di browser melalui `http://localhost:3000`

## **Struktur Project**

```
/cemilanceria
│
├── /app
│   ├── page.js          # Halaman utama produk
│   ├── layout.js        # Layout Utama
│   ├── globals.css      # File CSS Utama menggunakan Tailwind
│   ├── favicon.ico      # Icon Utama
│   └── /keranjang
│       └──  page.js      # Halaman keranjang produk
│
├── /components
│   ├── Navbar.js        # Navbar untuk navigasi
│   ├── Footer.js        # Navbar untuk detail brand
│   ├── /contexts        # Folder Menyimpan Context
│   ├── /ProductCard     # Folder Caraousel Product
│   ├── /TestimoniCard   # Folder Card Testimoni
│   └── Navbar.js        # Navbar untuk navigasi
│
└── tailwind.config.js   # Konfigurasi Tailwind CSS
```

## **Branch Legacy Version**

Jika Anda tertarik untuk melihat versi pertama dari aplikasi ini, Anda dapat mengaksesnya melalui branch berikut:

[Versi 1 - CemilanCeria](https://github.com/fauzaro01/cemilanceria/tree/v1-html)

## **Kontribusi**

Jika Anda tertarik untuk berkontribusi pada project ini, silakan ikuti langkah-langkah berikut:

1. Fork repository ini.
2. Buat branch baru untuk fitur atau perbaikan yang ingin Anda buat.
3. Lakukan perubahan dan buat pull request.

**Catatan**: Harap pastikan untuk menjalankan `npm run lint` sebelum mengajukan pull request untuk memastikan bahwa kode yang diajukan sesuai dengan standar proyek.

## **Licensing**

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail lebih lanjut.
