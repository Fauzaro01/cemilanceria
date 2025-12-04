const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth');

// Middleware to ensure admin access
router.use(ensureAuthenticated);
router.use(ensureAdmin);

router.get('/', (req, res) => {
    res.render('admin/dashboard', {
        user: req.user,
        activeMenu: 'dashboard'
    });
});

router.get('/products', (req, res) => {
  res.render('admin/products', {
    user: req.user,
    activeMenu: 'products'
  });
});

router.get('/orders', (req, res) => {
  res.render('admin/orders', {
    user: req.user,
    activeMenu: 'orders'
  });
});

router.get('/users', (req, res) => {
  res.render('admin/users', {
    user: req.user,
    activeMenu: 'users'
  });
});

module.exports = router;