/**
 * Created by jesseonolememen on 13/07/2017.
 */
var async = require('async'),
	keystone = require('keystone');

var Meal = keystone.list('Meal');
var MealReviews = keystone.list('MealReview');

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
		
		let _items;
		
		if (items) {
			_items = items.map(function (item) {
				delete item.user.password;
				return item
			})
		}
		
		res.json({
			results: _items || items,
		})
	})
};
