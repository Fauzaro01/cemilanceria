const express = require('express');
const path = require('path')
const fs = require('fs');
const app = express();

const port = 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')

// // ensure data folder exists
// const dataDir = path.join(__dirname, 'data');
// if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
// const ordersFile = path.join(dataDir, 'orders.json');
// if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, '[]');


// utama
app.get('/', (req, res) => {
    res.render('index');
})

app.get('/checkout', (req, res) => {
    res.render('checkout');
});

app.get('/cart', (req, res) => {
  res.render('cart');
});

app.get('/halamanproduk', (req, res) => {
    res.render('halamanproduk');
});

app.get('/pesanan', (req, res) => {
    res.render('pesanan');
});





app.post('/checkout', (req, res) => {
  try {
    const { cart } = req.body;

    let parsedCart = [];
    if (cart) {
      try {
        parsedCart = JSON.parse(cart);
      } catch (e) {
        console.error('Gagal parse cart JSON:', e);
        parsedCart = [];
      }
    }

    if (!parsedCart || parsedCart.length === 0) {
      // Jika cart kosong, tampilkan pesan sederhana atau redirect kembali
      return res.send(`<script>alert('Keranjang kosong. Tambahkan produk terlebih dahulu.'); window.location.href = '/cart';</script>`);
    }

    const order = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      // Informasi pengirim dihilangkan dari checkout untuk sekarang
      name: '',
      email: '',
      phone: '',
      address: '',
      cart: parsedCart,
      paymentMethod: req.body.paymentMethod || 'cod'
    };

    // // Simpan ke file orders.json
    // const existing = JSON.parse(fs.readFileSync(ordersFile, 'utf8') || '[]');
    // existing.push(order);
    // fs.writeFileSync(ordersFile, JSON.stringify(existing, null, 2));

    // Render halaman pesanan dengan data order (server-side)
    return res.render('pesanan', { order });

  } catch (err) {
    console.error('Error processing checkout:', err);
    return res.status(500).send('Terjadi kesalahan pada server.');
  }
});

app.get('/pesanan', (req, res) => {
    res.render('pesanan');
});

app.get('/admin/dashboard', (req, res) => {
  res.render('admin/dashboard', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'dashboard'
  });
});

app.get('/admin/products', (req, res) => {
  res.render('admin/products', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'products'
  });
});

app.get('/admin/orders', (req, res) => {
  res.render('admin/orders', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'orders'
  });
});

app.get('/admin/users', (req, res) => {
  res.render('admin/users', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'users'
  });
});

app.get('/admin/settings', (req, res) => {
  res.render('admin/settings', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'settings'
  });
});

// Placeholder API routes for backend integration (to be implemented by friend)
app.get('/api/users', (req, res) => {
  // Placeholder: Return empty array or mock data
  res.json([]);
});

app.get('/api/orders', (req, res) => {
  // Placeholder: Return empty array or mock data
  res.json([]);
});

app.get('/api/products', (req, res) => {
  // Placeholder: Return empty array or mock data
  res.json([]);
});

app.post('/api/users', (req, res) => {
  // Placeholder: Handle user creation
  res.status(501).json({ message: 'Not implemented yet' });
});

app.post('/api/orders', (req, res) => {
  // Placeholder: Handle order creation
  res.status(501).json({ message: 'Not implemented yet' });
});

app.post('/api/products', (req, res) => {
  // Placeholder: Handle product creation
  res.status(501).json({ message: 'Not implemented yet' });
});

app.listen(port, () => {
    console.log("Server sudah berjalan pada port 3000")

})
