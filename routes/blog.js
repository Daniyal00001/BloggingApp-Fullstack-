
const express = require('express');
const routes = express.Router();
const multer = require('multer');
const path = require('path');
const { Blog } = require('../models/blog');

// const { route } = require('./staticroutes');
// const routes = require('./staticroutes');



// add blog (/blog/add)
routes.get('/add', (req, res) => {
    res.render('addBlog', { error: null, user: req.user || null });
});


// routes.post(/blog/blog-add)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, '../public/images/uploads'));
    },
    filename: (req, file, cb) => {
        const filename  = Date.now() + '-' + file.originalname;
        cb(null, filename);
    }
});

const upload = multer({ storage });

routes.post('/add-blog', upload.single('image'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!image) {
            return res.render('addBlog', { 
                error: 'Please upload an image.', 
                user: req.user || null 
            });
        }

        // ❗ Include the logged-in user when creating the blog
        await Blog.create({ 
            title, 
            description, 
            image, 
            user: req.user._id      // ⬅️ Pass the user ID
        });

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.render('addBlog', { 
            error: 'Something went wrong. Please try again.', 
            user: req.user || null 
        });
    }
});


//export
module.exports = routes;

