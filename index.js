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

app.post('/checkout', (req, res) => {
    const { name, email, phone, address } = req.body;
    console.log('Order received:', { name, email, phone, address });
    res.send(`
        <script>
            localStorage.removeItem('cart');
            alert('Pesanan berhasil! Terima kasih telah berbelanja.');
            window.location.href = '/';
        </script>
    `);
});

app.listen(port, () => {
    console.log("Server sudah berjalan pada port 3000")

})
