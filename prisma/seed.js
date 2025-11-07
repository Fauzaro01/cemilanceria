const bcrypt = require('bcryptjs');
const { PrismaClient } = require('./generated/prisma');

const prisma = new PrismaClient();

async function createAdminUser() {
    try {
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (existingAdmin) {
            console.log('Admin user sudah ada:', existingAdmin.email);
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 12);

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

    } catch (error) {
        console.error('Error membuat admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

async function createProduct() {
    try {
        const product = await prisma.product.create({
            data: {
                name: 'Product Name',
                price: 10000,
                description: 'Product Description',
                stock: 10,
            }
        });

        console.log('Product berhasil dibuat:');
        console.log('ID:', product.id);
        console.log('Name:', product.name);
    } catch (error) {
        console.error('Error membuat product:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();