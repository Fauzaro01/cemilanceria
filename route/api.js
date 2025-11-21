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

// Product routes



// 404 Handler
router.get('/*path', (req, res) => {
    res.status(404).send({
        msg: "not found"
    });
})

module.exports = router