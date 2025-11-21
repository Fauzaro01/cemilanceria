const express = require('express');
const router = express.Router();
const { PrismaClient } = require('../../generated/prisma');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

const uploadDir = 'public/img/uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

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
            imageUrl: req.file ? `/img/uploads/${req.file.filename}` : null,
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
        
        if (req.file) {
            productData.imageUrl = `/img/uploads/${req.file.filename}`;
            
            if (existingProduct.imageUrl) {
                const oldImagePath = path.join('public', existingProduct.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
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
        
        // Delete image file if exists
        if (existingProduct.imageUrl) {
            const imagePath = path.join('public', existingProduct.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
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