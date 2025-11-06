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

app.get('/admin/dashboard', (req, res) => {
  res.render('admin/dashboard', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'dashboard'
  });
});

app.get('/admin/products', (req, res) => {
  res.render('admin/products', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'products'
  });
});

app.get('/admin/orders', (req, res) => {
  res.render('admin/orders', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'orders'
  });
});

app.get('/admin/users', (req, res) => {
  res.render('admin/users', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'users'
  });
});

app.get('/admin/settings', (req, res) => {
  res.render('admin/settings', {
    user: { name: 'Admin Cemilan' },
    activeMenu: 'settings'
  });
});

// Placeholder API routes for backend integration (to be implemented by friend)
app.get('/api/users', (req, res) => {
  // Placeholder: Return empty array or mock data
  res.json([]);
});

app.get('/api/orders', (req, res) => {
  // Placeholder: Return empty array or mock data
  res.json([]);
});

app.get('/api/products', (req, res) => {
  // Placeholder: Return empty array or mock data
  res.json([]);
});

app.post('/api/users', (req, res) => {
  // Placeholder: Handle user creation
  res.status(501).json({ message: 'Not implemented yet' });
});

app.post('/api/orders', (req, res) => {
  // Placeholder: Handle order creation
  res.status(501).json({ message: 'Not implemented yet' });
});

app.post('/api/products', (req, res) => {
  // Placeholder: Handle product creation
  res.status(501).json({ message: 'Not implemented yet' });
});

app.listen(port, () => {
    console.log("Server sudah berjalan pada port 3000")

})
