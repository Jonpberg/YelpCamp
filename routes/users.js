const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register')
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', `Hello ${registeredUser.username}, welcome to YelpCamp!`);
        res.redirect('/campgrounds');
    }
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}));

module.exports =  router;