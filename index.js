const express = require('express');
const app = express();

const port = 3000;

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(port, () => {
    console.log("Server sudah berjalan pada port 3000")
})