const express = require('express');
const path = require('path');
const conn = require('./conn');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from css, img, js directories
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// mount routers for user and admin pages
const userRoutes = require('./Routes/user');
const adminRoutes = require('./Routes/admin');

app.use('/', userRoutes);
app.use('/admin', adminRoutes);

// Backward-compatibility: redirect old .ejs URLs to proper routes
app.get('/views/admin/dashboard.ejs', (req, res) => {
  res.redirect('/admin/dashboard');
});
app.listen(2000, () => { console.log(`Server running at localhost:2000`); });