const express = require('express');
const router = express.Router();
const { ensureUser } = require('../middleware/auth');

// router.use(ensureUser);

router.get('/dashboard', (req, res) => {
    res.render('user/dashboard', { user: req.user });
});

router.get('/profile', (req, res) => {
    res.render('user/profile', { user: req.user });
});

router.get('/pesanan', (req, res) => {
    res.render('user/pesanan', { user: req.user });
});

module.exports = router;