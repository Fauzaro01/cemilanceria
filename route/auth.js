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
            console.error('Login error:', err);
            req.flash('error', 'Terjadi kesalahan pada server');
            return res.redirect('/login');
        }
        
        if (!user) {
            req.flash('error', info.message || 'Login gagal');
            req.flash('email', req.body.email);
            return res.redirect('/login');
        }
        
        req.logIn(user, (err) => {
            if (err) {
                console.error('Session error:', err);
                req.flash('error', 'Terjadi kesalahan saat membuat sesi');
                return res.redirect('/login');
            }
            
            if (user.role === 'ADMIN') {
                return res.redirect('/admin');
            } else {
                return res.redirect('/dashboard');
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            req.flash('error', 'Format email tidak valid');
            req.flash('formData', { name, email, phone, address });
            return res.redirect('/register');
        }
        
        // Validasi password match
        if (password !== confirmPassword) {
            req.flash('error', 'Password dan konfirmasi password tidak sama');
            req.flash('formData', { name, email, phone, address });
            return res.redirect('/register');
        }
        
        // Validasi password length
        if (password.length < 6) {
            req.flash('error', 'Password minimal 6 karakter');
            req.flash('formData', { name, email, phone, address });
            return res.redirect('/register');
        }

        // Validasi phone number jika diisi
        if (phone && phone.trim() !== '') {
            const phoneRegex = /^[0-9]{10,13}$/;
            if (!phoneRegex.test(phone)) {
                req.flash('error', 'Nomor telepon harus berupa 10-13 digit angka');
                req.flash('formData', { name, email, phone, address });
                return res.redirect('/register');
            }
        }
        
        // Cek apakah email sudah digunakan
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        });
        
        if (existingUser) {
            req.flash('error', 'Email sudah terdaftar. Silakan gunakan email lain atau login.');
            req.flash('formData', { name, phone, address });
            return res.redirect('/register');
        }
        
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const newUser = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                phone: phone && phone.trim() !== '' ? phone.trim() : null,
                address: address && address.trim() !== '' ? address.trim() : null,
                role: 'USER'
            }
        });
        
        req.flash('success', 'Pendaftaran berhasil! Silakan login dengan akun Anda.');
        res.redirect('/login');
        
    } catch (error) {
        console.error('Register error:', error);
        
        // Handle Prisma specific errors
        if (error.code === 'P2002') {
            req.flash('error', 'Email sudah terdaftar');
        } else {
            req.flash('error', 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
        }
        
        req.flash('formData', req.body);
        res.redirect('/register');
    }
});

// Route untuk logout
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
            }
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});

// Route untuk logout via GET (untuk kemudahan)
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Session destroy error:', err);
            }
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});

module.exports = router;