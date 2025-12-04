const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../../generated/prisma');
const multer = require('multer');
const { cloudinary, storage } = require('../../config/cloudinary');

const prisma = new PrismaClient();

// Configure multer with Cloudinary storage
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Helper function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary')) return null;
    // Extract public_id from Cloudinary URL
    // Example: https://res.cloudinary.com/xxx/image/upload/v123/cemilanceria/products/abc.jpg
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
        // Get the path after version number
        const pathParts = parts.slice(uploadIndex + 2);
        // Remove file extension and join
        const publicId = pathParts.join('/').replace(/\.[^/.]+$/, '');
        return publicId;
    }
    return null;
};

// Middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send({
                msg: 'File size too large. Maximum size is 5MB.'
            });
        }
    } else if (err) {
        return res.status(400).send({
            msg: err.message
        });
    }
    next();
};

router.get('/products', async (req, res) => {
    const products = await prisma.product.findMany();
    res.send({
        products: products
    })  
})

router.post('/products', upload.single('image'), handleMulterError, async (req, res) => {
    try {
        const { name, price, description, stock, category, isActive } = req.body;
        
        const productData = {
            name,
            price: parseFloat(price),
            description: description || null,
            stock: parseInt(stock) || 0,
            category: category || null,
            imageUrl: req.file ? req.file.path : null, // Cloudinary URL
            isActive: isActive === 'false' ? false : true
        };

        const product = await prisma.product.create({
            data: productData
        });

        res.status(201).send({
            msg: "Product created successfully",
            product: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(400).send({
            msg: "Error creating product",
            error: error.message
        });
    }
});

router.put('/products/:id', upload.single('image'), handleMulterError, async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const { name, price, description, stock, category, isActive } = req.body;
        
        
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId }
        });
        
        if (!existingProduct) {
            return res.status(404).send({
                msg: "Product not found"
            });
        }
        
        const productData = {
            name,
            price: parseFloat(price),
            description: description || null,
            stock: parseInt(stock) || 0,
            category: category || null,
            isActive: isActive === 'false' ? false : true
        };
        
        // If new image is uploaded
        if (req.file) {
            productData.imageUrl = req.file.path; // Cloudinary URL
            
            // Delete old image from Cloudinary if exists
            if (existingProduct.imageUrl && existingProduct.imageUrl.includes('cloudinary')) {
                const publicId = getPublicIdFromUrl(existingProduct.imageUrl);
                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                        console.log('Old image deleted from Cloudinary:', publicId);
                    } catch (error) {
                        console.error('Error deleting old image from Cloudinary:', error);
                    }
                }
            }
        }

        const product = await prisma.product.update({
            where: { id: productId },
            data: productData
        });

        res.send({
            msg: "Product updated successfully",
            product: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).send({
            msg: "Error updating product",
            error: error.message
        });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        
        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId }
        });
        
        if (!existingProduct) {
            return res.status(404).send({
                msg: "Product not found"
            });
        }
        
        // Delete image from Cloudinary if exists
        if (existingProduct.imageUrl && existingProduct.imageUrl.includes('cloudinary')) {
            const publicId = getPublicIdFromUrl(existingProduct.imageUrl);
            if (publicId) {
                try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log('Image deleted from Cloudinary:', publicId);
                } catch (error) {
                    console.error('Error deleting image from Cloudinary:', error);
                }
            }
        }
        
        await prisma.product.delete({
            where: { id: productId }
        });

        res.send({
            msg: "Product deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(400).send({
            msg: "Error deleting product",
            error: error.message
        });
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });
        
        if (!product) {
            return res.status(404).send({
                msg: "Product not found"
            });
        }

        res.send({
            product: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(400).send({
            msg: "Error fetching product",
            error: error.message
        });
    }
});

module.exports = router;