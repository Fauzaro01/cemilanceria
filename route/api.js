const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({
        msg: "ok"
    })
})

// 404 Handler
router.get('/*path', (req, res) => {
    res.status(404).send({
        msg: "not found"
    });
})

module.exports = router