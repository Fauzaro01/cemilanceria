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

// Get single order detail
router.get('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                orderItems: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Pesanan tidak ditemukan'
            });
        }

        // Parse shipping address if it's a JSON string
        let shippingAddress = null;
        if (order.shippingAddress) {
            try {
                shippingAddress = typeof order.shippingAddress === 'string' 
                    ? JSON.parse(order.shippingAddress) 
                    : order.shippingAddress;
            } catch (e) {
                shippingAddress = { fullAddress: order.shippingAddress };
            }
        }

        // Format order items
        const items = order.orderItems.map(item => ({
            ...item,
            product: item.product || { name: 'Produk tidak ditemukan', price: 0 }
        }));

        res.json({
            success: true,
            data: {
                ...order,
                shippingAddress,
                items,
                orderItems: undefined // Remove duplicate field
            }
        });
    } catch (error) {
        console.error('Error fetching order detail:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil detail pesanan'
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

// Get sales report
router.get('/reports/sales', async (req, res) => {
    try {
        const { period, startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                error: 'Tanggal mulai dan akhir harus diisi'
            });
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        // Get all orders in the date range
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: start,
                    lte: end
                }
            },
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        // Calculate summary
        const summary = {
            totalSales: 0,
            totalOrders: orders.length,
            completedOrders: 0,
            averageOrder: 0
        };

        orders.forEach(order => {
            if (['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status)) {
                summary.totalSales += order.totalAmount;
                if (order.status === 'DELIVERED') {
                    summary.completedOrders++;
                }
            }
        });

        summary.averageOrder = summary.totalOrders > 0 
            ? Math.round(summary.totalSales / summary.totalOrders) 
            : 0;

        // Group by period
        const groupedData = {};
        const chartLabels = [];
        const chartSales = [];
        const chartOrders = [];

        orders.forEach(order => {
            let periodKey;
            const orderDate = new Date(order.createdAt);

            if (period === 'week') {
                // Get week number
                const weekStart = new Date(orderDate);
                weekStart.setDate(orderDate.getDate() - orderDate.getDay());
                periodKey = weekStart.toLocaleDateString('id-ID', { 
                    day: '2-digit', 
                    month: 'short',
                    year: 'numeric'
                });
            } else {
                // Monthly
                periodKey = orderDate.toLocaleDateString('id-ID', { 
                    month: 'long',
                    year: 'numeric'
                });
            }

            if (!groupedData[periodKey]) {
                groupedData[periodKey] = {
                    period: periodKey,
                    totalSales: 0,
                    totalOrders: 0,
                    completed: 0,
                    pending: 0,
                    averageOrder: 0
                };
            }

            groupedData[periodKey].totalOrders++;
            
            if (['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status)) {
                groupedData[periodKey].totalSales += order.totalAmount;
            }
            
            if (order.status === 'DELIVERED') {
                groupedData[periodKey].completed++;
            } else if (order.status === 'PENDING') {
                groupedData[periodKey].pending++;
            }
        });

        // Calculate averages and prepare chart data
        const details = Object.values(groupedData).map(item => {
            item.averageOrder = item.totalOrders > 0 
                ? Math.round(item.totalSales / item.totalOrders) 
                : 0;
            
            chartLabels.push(item.period);
            chartSales.push(item.totalSales);
            chartOrders.push(item.totalOrders);
            
            return item;
        });

        res.json({
            success: true,
            data: {
                summary,
                details,
                chart: {
                    labels: chartLabels,
                    sales: chartSales,
                    orders: chartOrders
                }
            }
        });
    } catch (error) {
        console.error('Error generating sales report:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal membuat laporan penjualan'
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
