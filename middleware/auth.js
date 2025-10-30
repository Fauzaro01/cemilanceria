// Middleware untuk memastikan user sudah login
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    // Redirect ke login jika belum login
    res.redirect('/login');
};

// Middleware untuk memastikan user belum login (untuk halaman login/register)
const ensureNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    // Redirect berdasarkan role jika sudah login
    if (req.user.role === 'ADMIN') {
        res.redirect('/dashboard');
    } else {
        res.redirect('/keranjang');
    }
};

// Middleware untuk memastikan user adalah admin
const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'ADMIN') {
        return next();
    }
    res.status(403).send('Access denied: Admin only');
};

// Middleware untuk redirect berdasarkan role setelah login
const redirectByRole = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'ADMIN') {
            return res.redirect('/dashboard');
        } else {
            return res.redirect('/keranjang');
        }
    }
    next();
};

module.exports = {
    ensureAuthenticated,
    ensureNotAuthenticated,
    ensureAdmin,
    redirectByRole
};