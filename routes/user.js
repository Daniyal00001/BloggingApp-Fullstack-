const routes = require('express').Router();
const User = require('../models/user');

///user/login
routes.get('/login', (req, res) => {
    res.render('login', { error: '' });
});

///user/signup
routes.get('/signup', (req, res) => {
    res.render('signup' , {error: ''});
});

routes.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        await User.create({ fullname, email, password });
        res.redirect('/user/login');
    } catch (err) {
        if (err.code === 11000) {
            res.render('signup', { error: 'Email already exists. Please use a different one.' });
        } else {
            res.render('signup', { error: 'Something went wrong. Please try again.' });
        }
    }
});

routes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('login', { error: 'Email and password are required.' });
        }

        const { token } = await User.matchpasswardAndGenerateToken(email, password);

        if (!token) {
            return res.render('login', { error: 'Invalid email or password.' });
        }

        res.cookie('token', token, { httpOnly: true });
        return res.redirect('/');

    } catch (err) {
        console.error(err);
        if (!res.headersSent) {
            res.render('login', { error: 'Invalid email or password.' });
        }
    }
});

routes.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
    
});


module.exports = routes;