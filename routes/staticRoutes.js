const routes = require('express').Router();
const { Blog } = require('../models/blog');
routes.get('/', async (req, res) => {
    try {
        // Fetch all blogs and populate user fullname
        const blogs = await Blog.find({}).populate('user', 'fullname');
        console.log('Fetched blogs:', blogs);

        // Render home page with blogs and user info
        res.render('home', {
            blogs,
            user: req.user || null
        });

    } catch (err) {
        console.error(err);

        // Render home page with error message if something fails
        res.render('home', {
            error: 'Something went wrong. Please try again.',
            blogs: [],  // Ensure blogs is still passed to avoid template errors
            user: req.user || null
        });
    }
});

module.exports = routes;
