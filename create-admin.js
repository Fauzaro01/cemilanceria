const bcrypt = require('bcryptjs');
const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        // Cek apakah admin sudah ada
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (existingAdmin) {
            console.log('Admin user sudah ada:', existingAdmin.email);
            return;
        }

        // Hash password untuk admin
        const hashedPassword = await bcrypt.hash('admin123', 12);

        // Buat admin user
        const adminUser = await prisma.user.create({
            data: {
                name: 'Administrator',
                email: 'admin@cemilanceria.com',
                password: hashedPassword,
                phone: '081234567890',
                address: 'Kantor Cemilanceria',
                role: 'ADMIN',
                isActive: true
            }
        });

        console.log('Admin user berhasil dibuat:');
        console.log('Email: admin@cemilanceria.com');
        console.log('Password: admin123');
        console.log('ID:', adminUser.id);

    } catch (error) {
        console.error('Error membuat admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();