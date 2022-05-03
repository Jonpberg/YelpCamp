const Campground = require('../models/campground'); 
const Review = require('../models/review');

module.exports = {
    createReview: async (req, res) => {
        const campground = await Campground.findById(req.params.id).populate('reviews');
        const review = new Review(req.body.review);
        let alreadyReviewed = false;
        review.author = req.user._id;
        campground.reviews.forEach((loopedReview) => {
            if(loopedReview.author.equals(review.author)) {
                alreadyReviewed = true;
            }
        });
        if (alreadyReviewed) {
            req.flash('error', `You already left a review for this Campground.`);
            res.redirect(`/campgrounds/${campground._id}`);
        }
        else if(review.author.equals(campground.author)) {
            req.flash('error', `You cannot review your own Campground.`);
            res.redirect(`/campgrounds/${campground._id}`);
        }
        else {
            campground.reviews.push(review);
            await review.save();
            await campground.save();
            req.flash('success', `You added a new review to ${campground.title}!`);
            res.redirect(`/campgrounds/${campground._id}`);
        }
    },
    destroyReview: async (req, res) => {
        const { id, reviewId } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', `You deleted a review from ${campground.title}!`);
        res.redirect(`/campgrounds/${id}`);
    }
}