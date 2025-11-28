const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma');
const midtransClient = require('midtrans-client');

const prisma = new PrismaClient();

// Initialize Midtrans Snap
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY
});

router.use('/', require('./api/product'));
router.use('/user', require('./api/user'));

router.get('/', (req, res) => {
    res.send({
        msg: "ok"
    })
})

router.get('/users', async (req, res) => {
    const users = await prisma.user.findMany({});
    res.send({
        users: users
    })
});

// API endpoint untuk verifikasi cart items
router.post('/cart/verify', async (req, res) => {
    try {
        const { items } = req.body;
        
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid cart items' });
        }

        // Get product IDs from cart
        const productIds = items.map(item => item.productId).filter(id => id);
        
        // Fetch products from database
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                isActive: true
            }
        });

        // Create verification result
        const verified = items.map(item => {
            const product = products.find(p => p.id === item.productId);
            
            if (!product) {
                return {
                    ...item,
                    available: false,
                    reason: 'Produk tidak ditemukan atau tidak aktif'
                };
            }

            if (product.stock === 0) {
                return {
                    ...item,
                    available: false,
                    reason: 'Stok habis',
                    stock: 0
                };
            }

            if (item.qty > product.stock) {
                return {
                    ...item,
                    available: true,
                    limitedStock: true,
                    maxQty: product.stock,
                    reason: `Stok tersisa ${product.stock}`,
                    currentPrice: product.price,
                    name: product.name,
                    image: product.imageUrl,
                    stock: product.stock
                };
            }

            return {
                ...item,
                available: true,
                currentPrice: product.price,
                name: product.name,
                image: product.imageUrl,
                stock: product.stock,
                priceChanged: item.price !== product.price
            };
        });

        res.json({ verified });
    } catch (error) {
        console.error('Error verifying cart:', error);
        res.status(500).json({ error: 'Gagal memverifikasi keranjang' });
    }
});

// Create Order API Endpoint
router.post('/orders/create', async (req, res) => {
    try {
        const { name, email, phone, address, notes, items } = req.body;

        // Validate input
        if (!name || !email || !phone || !address || !items || items.length === 0) {
            return res.status(400).json({ error: 'Data tidak lengkap' });
        }

        // Verify cart items with database
        const productIds = items.map(item => item.productId);
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
                isActive: true
            }
        });

        // Validate stock and calculate total
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            
            if (!product) {
                return res.status(400).json({ 
                    error: `Produk ${item.product} tidak ditemukan` 
                });
            }

            if (product.stock < item.qty) {
                return res.status(400).json({ 
                    error: `Stok ${product.name} tidak mencukupi (tersisa: ${product.stock})` 
                });
            }

            const subtotal = product.price * item.qty;
            totalAmount += subtotal;

            orderItems.push({
                productId: product.id,
                quantity: item.qty,
                price: product.price,
                subtotal: subtotal
            });
        }

        // Generate order number
        const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // Get or create user
        let user = null;
        if (req.isAuthenticated()) {
            user = req.user;
        } else {
            // Check if user exists by email
            user = await prisma.user.findUnique({
                where: { email }
            });
        }

        // Create order in database
        const order = await prisma.order.create({
            data: {
                orderNumber,
                userId: user ? user.id : null,
                status: 'PENDING',
                totalAmount,
                shippingAddress: address,
                notes: notes || null,
                snapToken: null, // Will be updated after generating token
                orderItems: {
                    create: orderItems
                }
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // Update product stock
        for (const item of orderItems) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });
        }

        // Generate Midtrans Snap Token
        const parameter = {
            transaction_details: {
                order_id: orderNumber,
                gross_amount: totalAmount
            },
            customer_details: {
                first_name: name,
                email: email,
                phone: phone,
                billing_address: {
                    address: address
                },
                shipping_address: {
                    address: address
                }
            },
            item_details: order.orderItems.map(item => ({
                id: item.product.id,
                price: item.price,
                quantity: item.quantity,
                name: item.product.name
            })),
            callbacks: {
                finish: `${req.protocol}://${req.get('host')}/pesanan/${orderNumber}`
            }
        };

        const transaction = await snap.createTransaction(parameter);

        // Update order with snap token
        await prisma.order.update({
            where: { id: order.id },
            data: { snapToken: transaction.token }
        });

        res.json({
            success: true,
            orderNumber: order.orderNumber,
            orderId: order.id,
            snapToken: transaction.token,
            redirectUrl: transaction.redirect_url
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ 
            error: 'Gagal membuat pesanan',
            message: error.message 
        });
    }
});

// Midtrans Payment Notification Handler
router.post('/orders/notification', async (req, res) => {
    try {
        const notification = await snap.transaction.notification(req.body);
        const orderNumber = notification.order_id;
        const transactionStatus = notification.transaction_status;
        const fraudStatus = notification.fraud_status;

        console.log('Payment notification:', {
            orderNumber,
            transactionStatus,
            fraudStatus
        });

        let orderStatus = 'PENDING';

        if (transactionStatus === 'capture') {
            if (fraudStatus === 'accept') {
                orderStatus = 'CONFIRMED';
            }
        } else if (transactionStatus === 'settlement') {
            orderStatus = 'CONFIRMED';
        } else if (transactionStatus === 'cancel' || 
                   transactionStatus === 'deny' || 
                   transactionStatus === 'expire') {
            orderStatus = 'CANCELLED';
        } else if (transactionStatus === 'pending') {
            orderStatus = 'PENDING';
        }

        // Update order status
        await prisma.order.update({
            where: { orderNumber },
            data: { status: orderStatus }
        });

        res.json({ success: true });

    } catch (error) {
        console.error('Error handling payment notification:', error);
        res.status(500).json({ error: 'Failed to process notification' });
    }
});


// 404 Handler
router.get('/*path', (req, res) => {
    res.status(404).send({
        msg: "not found"
    });
})

module.exports = router