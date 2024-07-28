const express = require('express');
const router = express.Router();


//Routes
//router.get('', (req, res) => {
//   res.send("Hello World");
//});

router.get('', (req, res) => {
    const locals = {
        title: "Appropriate Tech Blogs",
        description: "I commit to post appropriate tech blogs"
    }

    res.render('index', { locals });
})

router.get('', (req, res) => {
    res.render('index');
});

router.get('/about', (req, res) => {
    res.render('about');
});


module.exports = router;


