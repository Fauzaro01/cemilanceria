const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('../config/passport');
const { PrismaClient } = require('../generated/prisma');
const { ensureNotAuthenticated } = require('../middleware/auth');

const prisma = new PrismaClient();

router.get('/login', ensureNotAuthenticated, (req, res) => {
    res.render('login', { 
        error: req.flash('error')[0] || null,
        email: req.flash('email')[0] || ''
    });
});

router.get('/register', ensureNotAuthenticated, (req, res) => {
    res.render('register', { 
        error: req.flash('error')[0] || null,
        success: req.flash('success')[0] || null,
        formData: req.flash('formData')[0] || {}
    });
});

router.post('/login', ensureNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        
        if (!user) {
            req.flash('error', info.message || 'Login gagal');
            req.flash('email', req.body.email);
            return res.redirect('/login');
        }
        
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            
            if (user.role === 'ADMIN') {
                return res.redirect('/dashboard');
            } else {
                return res.redirect('/keranjang');
            }
        });
    })(req, res, next);
});

router.post('/register', ensureNotAuthenticated, async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, address } = req.body;
        
        if (!name || !email || !password) {
            req.flash('error', 'Nama, email, dan password wajib diisi');
            req.flash('formData', { name, email, phone, address });
            return res.redirect('/register');
        }
        
        if (password !== confirmPassword) {
            req.flash('error', 'Password dan konfirmasi password tidak sama');
            req.flash('formData', { name, email, phone, address });
            return res.redirect('/register');
        }
        
        if (password.length < 6) {
            req.flash('error', 'Password minimal 6 karakter');
            req.flash('formData', { name, email, phone, address });
            return res.redirect('/register');
        }
        
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        
        if (existingUser) {
            req.flash('error', 'Email sudah digunakan');
            req.flash('formData', { name, phone, address });
            return res.redirect('/register');
        }
        
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone: phone || null,
                address: address || null,
                role: 'USER'
            }
        });
        
        req.flash('success', 'Akun berhasil dibuat! Silakan login.');
        res.redirect('/login');
        
    } catch (error) {
        console.error('Register error:', error);
        req.flash('error', 'Terjadi kesalahan saat mendaftar');
        req.flash('formData', req.body);
        res.redirect('/register');
    }
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Anda telah berhasil logout');
        res.redirect('/');
    });
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;