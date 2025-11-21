const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('admin/dashboard', {
        user: { name: 'Admin Cemilan' },
        activeMenu: 'dashboard'
    });
})

router.get('/products', (req, res) => {
  res.render('admin/products', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'products'
  });
});

router.get('/orders', (req, res) => {
  res.render('admin/orders', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'orders'
  });
});

router.get('/users', (req, res) => {
  res.render('admin/users', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'users'
  });
});

router.get('/settings', (req, res) => {
  res.render('admin/settings', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'settings'
  });
});

// 404 Handler
router.get('/*path', (req, res) => {
    res.status(404).send({
        msg: "not found"
    });
})

module.exports = router