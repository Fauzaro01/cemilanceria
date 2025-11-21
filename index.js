require('dotenv').config({ quiet: true });
const express = require('express');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passport');
const { ensureAuthenticated } = require('./middleware/auth');
const { PrismaClient } = require('./generated/prisma');

const app = express();
const prisma = new PrismaClient();

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

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('user/dashboard');
});

app.get('/products', async (req, res) => {
    try {
        const search = req.query.search || '';
        const category = req.query.category || '';
        
        // Build query conditions
        const whereConditions = {
            isActive: true // Only show active products
        };
        
        // Add search condition if provided
        if (search) {
            whereConditions.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
                { category: { contains: search } }
            ];
        }
        
        // Add category filter if provided
        if (category) {
            whereConditions.category = category;
        }
        
        // Fetch products from database
        const products = await prisma.product.findMany({
            where: whereConditions,
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        // Get unique categories for filter
        const categories = await prisma.product.findMany({
            where: { isActive: true },
            select: { category: true },
            distinct: ['category']
        });
        
        const uniqueCategories = categories
            .map(c => c.category)
            .filter(c => c !== null);
        
        res.render('products', { 
            products, 
            search,
            category,
            categories: uniqueCategories
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('products', { 
            products: [], 
            search: '',
            category: '',
            categories: [],
            error: 'Gagal memuat produk'
        });
    }
});

app.get('/cart', (req, res) => {
  res.render('cart');
});

app.get('/checkout', (req, res) => {
    res.render('checkout');
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

    return res.render('pesanan', { order });

  } catch (err) {
    console.error('Error processing checkout:', err);
    return res.status(500).send('Terjadi kesalahan pada server.');
  }
});

app.get('/pesanan', (req, res) => {
  res.render('pesanan');
});

app.listen(process.env.PORT, () => {
    console.log(`[🚀] Server sudah berjalan pada http://localhost:${process.env.PORT}`);
});
