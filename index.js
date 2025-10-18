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

/* <halamanlogin */
app.get('/login', (req, res) => {
    res.render('login');
});

app.listen(port, () => {
    console.log("Server sudah berjalan pada port 3000")
})