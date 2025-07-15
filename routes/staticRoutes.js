const routes = require('express').Router();

routes.get('/', (req, res) => {
     console.log('req.user on homepage:', req.user); 
    res.render('home', { user: req.user || null });

});

module.exports = routes;