const express = require('express')
const connection = require('./connection')
const path = require('path')
const staticRoutes = require('./routes/staticroutes')
const userRoutes = require('./routes/user')
const blogRoutes = require('./routes/blog')
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require('./middlewares/auth')
const { validateToken, Generatetoken } = require('./Service/Auth')
const app = express()
const port = 3000

//ejs setup
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

//db connection
connection.connectDB()

//middeleware
app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use('/images', express.static(path.resolve('./public/images/uploads')));

//routes
app.use('/', staticRoutes);
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})