/**
 * Created by jesseonolememen on 13/07/2017.
 */
var async = require('async'),
	keystone = require('keystone');

var Meal = keystone.list('Meal');

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
