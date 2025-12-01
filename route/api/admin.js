const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const { ensureAuthenticated, ensureAdmin } = require('../../middleware/auth');

// Middleware to ensure admin access
router.use(ensureAuthenticated);
router.use(ensureAdmin);

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        // Get active products count
        const activeProducts = await prisma.product.count({
            where: { isActive: true }
        });

        // Get today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get today's orders
        const todayOrders = await prisma.order.count({
            where: {
                createdAt: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });

        // Get today's revenue (only confirmed/completed orders)
        const todayRevenue = await prisma.order.aggregate({
            where: {
                createdAt: {
                    gte: today,
                    lt: tomorrow
                },
                status: {
                    in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
                }
            },
            _sum: {
                totalAmount: true
            }
        });

        // Get total users
        const totalUsers = await prisma.user.count({
            where: { role: 'USER' }
        });

        // Get pending orders
        const pendingOrders = await prisma.order.count({
            where: { status: 'PENDING' }
        });

        res.json({
            success: true,
            data: {
                activeProducts,
                todayOrders,
                todayRevenue: todayRevenue._sum.totalAmount || 0,
                totalUsers,
                pendingOrders
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil statistik'
        });
    }
});

// Get all orders with filters
router.get('/orders', async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        
        const whereClause = {};
        
        if (status && status !== 'all') {
            whereClause.status = status.toUpperCase();
        }
        
        if (search) {
            whereClause.OR = [
                { orderNumber: { contains: search } },
                { shippingAddress: { contains: search } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: whereClause,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    orderItems: {
                        include: {
                            product: {
                                select: {
                                    name: true,
                                    price: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: parseInt(limit)
            }),
            prisma.order.count({ where: whereClause })
        ]);

        res.json({
            success: true,
            data: orders,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil data pesanan'
        });
    }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Status tidak valid'
            });
        }

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        res.json({
            success: true,
            message: 'Status pesanan berhasil diperbarui',
            data: order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal memperbarui status pesanan'
        });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const { search, role, page = 1, limit = 10 } = req.query;
        
        const whereClause = {};
        
        if (role && role !== 'all') {
            whereClause.role = role.toUpperCase();
        }
        
        if (search) {
            whereClause.OR = [
                { name: { contains: search } },
                { email: { contains: search } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    _count: {
                        select: {
                            orders: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: parseInt(limit)
            }),
            prisma.user.count({ where: whereClause })
        ]);

        res.json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil data pengguna'
        });
    }
});

// Toggle user active status
router.put('/users/:id/toggle-active', async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Pengguna tidak ditemukan'
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { isActive: !user.isActive }
        });

        res.json({
            success: true,
            message: `Pengguna berhasil ${updatedUser.isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
            data: updatedUser
        });
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengubah status pengguna'
        });
    }
});

// Get recent activities (orders + products)
router.get('/activities', async (req, res) => {
    try {
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock: { lte: 10 },
                isActive: true
            },
            orderBy: { stock: 'asc' },
            take: 5
        });

        res.json({
            success: true,
            data: {
                recentOrders,
                lowStockProducts
            }
        });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil aktivitas'
        });
    }
});

module.exports = router;
