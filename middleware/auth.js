const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

const ensureNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    if (req.user.role === 'ADMIN') {
        res.redirect('/dashboard');
    } else {
        res.redirect('/keranjang');
    }
};

const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'ADMIN') {
        return next();
    }
    res.status(403).send('Access denied: Admin only');
};

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