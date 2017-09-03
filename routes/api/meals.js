/**
 * Created by jesseonolememen on 13/07/2017.
 */
var async = require('async'),
	keystone = require('keystone');

let Meal = keystone.list('Meal');
let MealReviews = keystone.list('MealReview');
let MealFavourite = keystone.list('MealFavourite');

exports.meals = function (req, res) {
	Meal.model.find().where('categories').in([req.params.id]).populate('options').populate('categories').exec(function (err, items) {
		if (err) {
			console.log(err);
			res.json({ success: false, message: err.message || "Failed to fetch meals for category" });
		}

		res.json({
			results: {
				meals: items
			}
		});
	});
};

exports.getReviews = function (req, res) {
	MealReviews.model.find().where('meal', req.params.id).populate('user', '_id name profileImage').populate('meal').exec(function (err, items) {
		if (err) {
			res.json({ success: false, message: err.message || "Failed to fetch reviews for meal" });
		}
		
		res.json({
			results: items,
		})
	})
};

exports.getFavouritesForUser = function (req, res) {
	MealFavourite.model.find().where('user', req.params.id).populate('meal').populate('user', '-password').exec(function (err, items) {
		if (err) return res.json({
			error: err,
			success: false,
		});

		res.json({
			success: true,
			results: items
		});
	});
};
