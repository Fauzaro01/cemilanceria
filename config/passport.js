const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

// Konfigurasi Local Strategy
passport.use(new LocalStrategy(
    {
        usernameField: 'email', // Menggunakan email sebagai username
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            // Cari user berdasarkan email
            const user = await prisma.user.findUnique({
                where: { email: email }
            });

            if (!user) {
                return done(null, false, { message: 'Email tidak ditemukan' });
            }

            // Cek apakah user aktif
            if (!user.isActive) {
                return done(null, false, { message: 'Akun tidak aktif' });
            }

            // Verifikasi password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Password salah' });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// Serialize user untuk session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user dari session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                address: true,
                role: true,
                isActive: true
            }
        });
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;