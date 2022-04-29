const Campground = require('../models/campground'); 

module.exports = {
    index: async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    },
    renderNewForm: (req, res) => {
        res.render('campgrounds/new');
    },
    showCampground: async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
        if(!campground) {
            req.flash('error', `Could not find that campground.`);
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground });
    },
    createCampground: async (req, res, next) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash('success', `You have created ${campground.title}!`);
        res.redirect(`/campgrounds/${campground._id}`); 
    },
    renderEditForm: async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if(!campground) {
            req.flash('error', `Could not find that campground to edit.`);
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', { campground });
    },
    updateCampground: async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {new: true});
        req.flash('success', `You have edited ${campground.title}!`);
        res.redirect(`/campgrounds/${campground._id}`);
    },
    destroyCampground: async (req, res) => {
        const { id } = req.params;
        const deletedCampground = await Campground.findByIdAndDelete(id);
        req.flash('success', `You have deleted ${deletedCampground.title}!`);
        res.redirect('/campgrounds');
    }
}