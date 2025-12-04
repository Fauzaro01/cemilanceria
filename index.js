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
app.use('/user', require('./route/user'));
app.use('/admin', require('./route/admin'));

app.get('/', async (req, res) => {
    try {
        // Fetch all active products with stock
        const allProducts = await prisma.product.findMany({
            where: { 
                isActive: true,
                stock: { gt: 0 }
            }
        });
        
        // Shuffle array to get random products
        const shuffled = allProducts.sort(() => 0.5 - Math.random());
        
        // Take 3 random products for carousel and featured section
        const randomProducts = shuffled.slice(0, 3);
        
        res.render('index', { 
            carouselProducts: randomProducts,
            featuredProducts: randomProducts
        });
    } catch (error) {
        console.error('Error fetching products for homepage:', error);
        res.render('index', { 
            carouselProducts: [],
            featuredProducts: []
        });
    }
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

app.get('/cart', ensureAuthenticated, (req, res) => {
  res.render('cart');
});

app.get('/checkout', ensureAuthenticated, (req, res) => {
    res.render('checkout');
});

app.get('/pesanan/:orderNumber', ensureAuthenticated, async (req, res) => {
    try {
        const { orderNumber } = req.params;
        
        const order = await prisma.order.findUnique({
            where: { orderNumber },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                user: true
            }
        });

        if (!order) {
            return res.status(404).send('Pesanan tidak ditemukan');
        }

        res.render('pesanan', { 
            order,
            midtransClientKey: process.env.MIDTRANS_CLIENT_KEY 
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).send('Terjadi kesalahan');
    }
});

app.get('/pesanan', ensureAuthenticated, (req, res) => {
  res.render('pesanan', { 
      order: null,
      midtransClientKey: process.env.MIDTRANS_CLIENT_KEY 
  });
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('user/dashboard', { user: req.user });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.use((req, res, next) => {
    res.status(404).render('404', {
        user: req.user || null
    });
});

app.listen(process.env.PORT, () => {
    console.log(`[🚀] Server sudah berjalan pada http://localhost:${process.env.PORT}`);
});
