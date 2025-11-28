const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();
const { ensureAuthenticated } = require('../../middleware/auth');

// Get user statistics
router.get('/stats', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get total orders
        const totalOrders = await prisma.order.count({
            where: { userId }
        });

        // Get total spending (only from completed orders)
        const completedOrders = await prisma.order.findMany({
            where: {
                userId,
                status: {
                    in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
                }
            },
            select: {
                totalAmount: true
            }
        });

        const totalSpending = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Get pending orders count
        const pendingOrders = await prisma.order.count({
            where: {
                userId,
                status: 'PENDING'
            }
        });

        res.json({
            success: true,
            data: {
                totalOrders,
                totalSpending,
                pendingOrders
            }
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil statistik'
        });
    }
});

// Get user orders
router.get('/orders', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { status } = req.query;

        const whereClause = { userId };
        if (status && status !== 'all') {
            if (status === 'pending') {
                whereClause.status = 'PENDING';
            } else if (status === 'completed') {
                whereClause.status = {
                    in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']
                };
            }
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil data pesanan'
        });
    }
});

// Get recent orders (limit 5)
router.get('/orders/recent', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: {
                                name: true,
                                imageUrl: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengambil pesanan terbaru'
        });
    }
});

// Update user profile
router.put('/profile', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone, address } = req.body;

        // Check if email is already taken by another user
        if (email && email !== req.user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({
                    success: false,
                    error: 'Email sudah digunakan oleh pengguna lain'
                });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name || req.user.name,
                email: email || req.user.email,
                phone: phone || req.user.phone,
                address: address || req.user.address
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                address: true,
                role: true
            }
        });

        res.json({
            success: true,
            message: 'Profil berhasil diperbarui',
            data: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal memperbarui profil'
        });
    }
});

// Change password
router.put('/change-password', ensureAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Password lama dan baru harus diisi'
            });
        }

        // Get user with password
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        // Verify old password
        const bcrypt = require('bcryptjs');
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: 'Password lama tidak sesuai'
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.json({
            success: true,
            message: 'Password berhasil diubah'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            error: 'Gagal mengubah password'
        });
    }
});

module.exports = router;
