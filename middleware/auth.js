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
        res.redirect('/admin');
    } else {
        res.redirect('/dashboard');
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
            return res.redirect('/admin');
        } else {
            return res.redirect('/dashboard');
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