const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

router.use('/', require('./api/product'));

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


// 404 Handler
router.get('/*path', (req, res) => {
    res.status(404).send({
        msg: "not found"
    });
})

module.exports = router