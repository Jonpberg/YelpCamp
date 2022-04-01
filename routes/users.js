const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register')
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            req.flash('success', `Hello ${registeredUser.username}, welcome to YelpCamp!`);
            res.redirect('/campgrounds');
        });
    }
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    req.session.previousUrl = req.get('referer');
    if (req.session.previousUrl && (req.session.previousUrl.includes(req.originalUrl) || req.session.previousUrl.includes('register'))) {
        delete req.session.previousUrl;
    }
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async(req, res) => {
    const redirectUrl = req.session.returnTo || req.session.previousUrl || '/campgrounds';
    delete req.session.returnTo;
    delete req.session.previousUrl;
    req.flash('success', `Welcome back, ${req.body.username}.`)
    res.redirect(redirectUrl);
});

router.get('/logout', async (req, res) => {
    req.logout();
    req.flash('success', `Logged out of ${req.appName}.`);
    res.redirect('/campgrounds');
});

module.exports =  router;