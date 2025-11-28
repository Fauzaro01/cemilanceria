const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');

router.use(ensureAuthenticated);

router.get('/profile', (req, res) => {
    res.render('user/profile', { user: req.user });
});

router.get('/pesanan', (req, res) => {
    res.render('user/pesanan', { user: req.user });
});

module.exports = router;