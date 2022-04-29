const User = require('../models/user');
const Campground = require('../models/campground');

module.exports = {
    renderRegister: (req, res) => {
        res.render('users/register')
    },
    showUser: async (req, res) => {
        const { userId } = req.params;
        const userCampgrounds = [];
        const userReviews = [];
        const user = await User.findById(userId);
        const campgrounds = await Campground.find({}).populate('author').populate('reviews');
        campgrounds.forEach(function(campground) {
            if(campground.author._id.equals(userId)) {
                userCampgrounds.push(campground);
            }
            campground.reviews.forEach(function(review) {
                if(review.author.equals(userId)) {
                    let appendedReview = {
                        campgroundTitle: campground.title,
                        campgroundId: campground._id,
                        reviewBody: review.body,
                        reviewRating: review.rating,
                        reviewAuthor: user.username
                    }
                    userReviews.push(appendedReview);
                }
            })
        })
        res.render('users/show', { userCampgrounds, userReviews, user });
    },
    register: async (req, res) => {
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
    },
    renderLogin: (req, res) => {
        req.session.previousUrl = req.get('referer');
        if (req.session.previousUrl && (req.session.previousUrl.includes(req.originalUrl) || req.session.previousUrl.includes('register'))) {
            delete req.session.previousUrl;
        }
        res.render('users/login');
    },
    login: async(req, res) => {
        const redirectUrl = req.session.returnTo || req.session.previousUrl || '/campgrounds';
        delete req.session.returnTo;
        delete req.session.previousUrl;
        req.flash('success', `Welcome back, ${req.body.username}.`)
        res.redirect(redirectUrl);
    },
    logout: async (req, res) => {
        req.logout();
        req.flash('success', `Logged out of ${req.appName}.`);
        res.redirect('/campgrounds');
    }
}