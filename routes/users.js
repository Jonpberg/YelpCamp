const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const User = require('../models/user');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), users.login);

router.get('/users/:userId', users.showUser)

router.get('/logout', users.logout);

module.exports =  router;