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

app.listen(process.env.PORT, () => {
    console.log(`[🚀] Server sudah berjalan pada http://localhost:${process.env.PORT}`);
});