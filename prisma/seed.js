const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function cleanDatabase() {
    try {
        console.log('🧹 Cleaning existing data...');
        
        // Delete in order to respect foreign key constraints
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.product.deleteMany();
        // Keep admin user, only delete test users
        await prisma.user.deleteMany({
            where: {
                email: {
                    not: 'admin@cemilanceria.com'
                }
            }
        });
        
        console.log('✅ Database cleaned successfully');
    } catch (error) {
        console.error('❌ Error cleaning database:', error);
        throw error;
    }
}

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
        // Cek apakah sudah ada produk
        const existingProducts = await prisma.product.count();
        if (existingProducts > 0) {
            console.log('Products sudah ada:', existingProducts, 'produk');
            return;
        }

        const products = await prisma.product.createMany({
            data: [
                {
                    name: 'Puding Coklat',
                    description: 'Puding lembut dengan rasa coklat premium yang nikmat',
                    price: 15000,
                    stock: 50,
                    category: 'Puding',
                    imageUrl: 'https://i.pinimg.com/736x/cf/95/2c/cf952c0bb7fee5b59c8bb0a94ac8b58b.jpg',
                    isActive: true
                },
                {
                    name: 'Puding Strawberry',
                    description: 'Puding segar dengan rasa strawberry asli',
                    price: 15000,
                    stock: 45,
                    category: 'Puding',
                    imageUrl: 'https://i.pinimg.com/1200x/09/ed/d1/09edd1af0af9acc6620736297148101e.jpg',
                    isActive: true
                },
                {
                    name: 'Puding Mangga',
                    description: 'Puding klasik dengan rasa mangga yang lembut',
                    price: 12000,
                    stock: 60,
                    category: 'Puding',
                    imageUrl: 'https://i.pinimg.com/736x/0a/fc/ec/0afcec3b9110d0fa793b911464f5f2fb.jpg',
                    isActive: true
                },
                {
                    name: 'Cireng Isi Ayam',
                    description: 'Cireng crispy dengan isian ayam gurih dan bumbu spesial',
                    price: 8000,
                    stock: 30,
                    category: 'Cireng',
                    imageUrl: 'https://i.pinimg.com/1200x/2a/8b/4c/2a8b4c995f0cce056d5240cbb6d94744.jpg',
                    isActive: true
                },
                {
                    name: 'Cireng Isi Keju',
                    description: 'Cireng dengan isian keju mozzarella yang meleleh',
                    price: 10000,
                    stock: 25,
                    category: 'Cireng',
                    imageUrl: 'https://i.pinimg.com/1200x/2a/8b/4c/2a8b4c995f0cce056d5240cbb6d94744.jpg',
                    isActive: true
                },
                {
                    name: 'Lumpia Kering',
                    description: 'Lumpia kering dengan isian kornet sapi yang lezat',
                    price: 12000,
                    stock: 20,
                    category: 'Cireng',
                    imageUrl: 'https://i.pinimg.com/1200x/e2/e1/15/e2e1154998dd10acbe8876a69d436462.jpg',
                    isActive: true
                },
                {
                    name: 'Basreng Original',
                    description: 'Basreng original dengan bumbu kacang dan kerupuk',
                    price: 5000,
                    stock: 40,
                    category: 'Cireng',
                    imageUrl: 'https://i.pinimg.com/736x/69/30/ba/6930ba0dbfd51f317aa1b6bce0454cb2.jpg',
                    isActive: true
                },
            ]
        });

        console.log('Products berhasil dibuat:', products.count, 'produk');

    } catch (error) {
        console.error('Error membuat products:', error);
    }
}

async function createOrders() {
    try {
        // Cek apakah sudah ada orders
        const existingOrders = await prisma.order.count();
        if (existingOrders > 0) {
            console.log('Orders sudah ada:', existingOrders, 'pesanan');
            return;
        }

        // Ambil user admin sebagai contoh
        const adminUser = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (!adminUser) {
            console.log('Admin user tidak ditemukan, skip creating orders');
            return;
        }

        // Buat beberapa user dummy untuk testing
        const testUsers = await prisma.user.createMany({
            data: [
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: await bcrypt.hash('password123', 12),
                    phone: '081234567891',
                    address: 'Jl. Sudirman No. 123, Jakarta',
                    role: 'USER',
                    isActive: true
                },
                {
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    password: await bcrypt.hash('password123', 12),
                    phone: '081234567892',
                    address: 'Jl. Thamrin No. 456, Jakarta',
                    role: 'USER',
                    isActive: true
                },
                {
                    name: 'Bob Wilson',
                    email: 'bob@example.com',
                    password: await bcrypt.hash('password123', 12),
                    phone: '081234567893',
                    address: 'Jl. Gatot Subroto No. 789, Jakarta',
                    role: 'USER',
                    isActive: true
                }
            ]
        });

        // Ambil semua user untuk orders
        const allUsers = await prisma.user.findMany({
            where: { role: 'USER' }
        });

        // Ambil beberapa produk untuk orders
        const products = await prisma.product.findMany({
            take: 5
        });

        if (products.length === 0) {
            console.log('Tidak ada produk, skip creating orders');
            return;
        }

        // Buat orders dummy
        const orders = [];
        for (let i = 0; i < 8; i++) {
            const user = allUsers[Math.floor(Math.random() * allUsers.length)];
            const orderNumber = `ORD-${Date.now()}-${i.toString().padStart(3, '0')}`;
            const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            
            orders.push({
                orderNumber,
                userId: user.id,
                status,
                totalAmount: 0, // Will be calculated after items
                shippingAddress: user.address,
                notes: `Catatan pesanan ${i + 1} - ${status.toLowerCase()}`,
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
            });
        }

        // Buat orders satu per satu untuk mendapatkan ID
        for (const orderData of orders) {
            const order = await prisma.order.create({
                data: orderData
            });

            // Buat order items untuk setiap order
            const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
            let totalAmount = 0;
            const usedProducts = new Set(); // Untuk mencegah duplikasi produk dalam satu order

            for (let j = 0; j < numItems; j++) {
                // Pilih produk yang belum digunakan dalam order ini
                let product;
                let attempts = 0;
                do {
                    product = products[Math.floor(Math.random() * products.length)];
                    attempts++;
                } while (usedProducts.has(product.id) && attempts < 10);
                
                // Jika sudah 10 kali mencoba dan masih duplikat, skip item ini
                if (usedProducts.has(product.id)) {
                    continue;
                }
                
                usedProducts.add(product.id);
                
                const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
                const price = product.price;
                const subtotal = price * quantity;
                totalAmount += subtotal;

                await prisma.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: product.id,
                        quantity,
                        price,
                        subtotal
                    }
                });
            }

            // Update total amount di order
            await prisma.order.update({
                where: { id: order.id },
                data: { totalAmount }
            });
        }

        console.log('Orders berhasil dibuat:', orders.length, 'pesanan');
        console.log('Test users berhasil dibuat:', testUsers.count, 'user');

    } catch (error) {
        console.error('Error membuat orders:', error);
    }
}

async function main() {
    try {
        console.log('🚀 Starting database seeding...\n');
        
        // Check if we should clean first
        const shouldClean = process.argv.includes('--clean');
        if (shouldClean) {
            await cleanDatabase();
            console.log('');
        }
        
        // 1. Create Admin User
        console.log('1️⃣ Creating admin user...');
        await createAdminUser();
        
        // 2. Create Products
        console.log('\n2️⃣ Creating products...');
        await createProduct();
        
        // 3. Create Orders and Test Users
        console.log('\n3️⃣ Creating orders and test users...');
        await createOrders();
        
        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        
        // Show summary
        const userCount = await prisma.user.count();
        const productCount = await prisma.product.count();
        const orderCount = await prisma.order.count();
        const orderItemCount = await prisma.orderItem.count();
        
        console.log(`👥 Users: ${userCount}`);
        console.log(`📦 Products: ${productCount}`);
        console.log(`🛒 Orders: ${orderCount}`);
        console.log(`📝 Order Items: ${orderItemCount}`);
        
        console.log('\n🔑 Login credentials:');
        console.log('Admin: admin@cemilanceria.com / admin123');
        console.log('Test User 1: john@example.com / password123');
        console.log('Test User 2: jane@example.com / password123');
        console.log('Test User 3: bob@example.com / password123');
        
        console.log('\n💡 Tips:');
        console.log('- Run with --clean to reset all data first');
        console.log('- Use npm run seed or node prisma/seed.js');
        
    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}

// Run the seeding
main()
    .catch((error) => {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('\n🔌 Database connection closed');
    });