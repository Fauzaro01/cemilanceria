require('dotenv').config({ quiet: true });
const express = require('express');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passport');
const { ensureAuthenticated } = require('./middleware/auth');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET || 'cemilanceria-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

app.use('/', require('./route/auth'));
app.use('/api', require('./route/api'));
app.use('/admin', require('./route/admin'));

// // ensure data folder exists
// const dataDir = path.join(__dirname, 'data');
// if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
// const ordersFile = path.join(dataDir, 'orders.json');
// if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, '[]');


// utama
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/keranjang', ensureAuthenticated, (req, res) => {
    if (req.user.role === 'ADMIN') {
        return res.redirect('/dashboard');
    }
    res.send('<h1>Halaman Keranjang</h1><p>Selamat datang di keranjang belanja, ' + req.user.name + '!</p><a href="/logout">Logout</a>');
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.redirect('/keranjang');
    }
    res.send('<h1>Dashboard Admin</h1><p>Selamat datang di dashboard, ' + req.user.name + '!</p><a href="/logout">Logout</a>');
});

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

app.listen(process.env.PORT, () => {
    console.log(`[🚀] Server sudah berjalan pada http://localhost:${process.env.PORT}`);
});
