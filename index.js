const express = require('express');
const path = require('path')
const app = express();

const port = 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')


// utama
app.get('/', (req, res) => {
    res.render('index');
})

app.get('/checkout', (req, res) => {
    res.render('checkout');
});

app.get('/halamanproduk', (req, res) => {
    res.render('halamanproduk');
});

app.get('/pesanan', (req, res) => {
    res.render('pesanan');
});





app.post('/checkout', (req, res) => {
    const { name, email, phone, address } = req.body;
    console.log('Order received:', { name, email, phone, address });
    res.send(`
        <script>
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const orderData = { name, email, phone, address, cart };
            localStorage.setItem('currentOrder', JSON.stringify(orderData));
            localStorage.removeItem('cart');
            alert('Pesanan berhasil! Terima kasih telah berbelanja.');
            window.location.href = '/pesanan';
        </script>
    `);
});

app.get('/pesanan', (req, res) => {
    res.render('pesanan');
});





app.listen(port, () => {
    console.log("Server sudah berjalan pada port 3000")

})
