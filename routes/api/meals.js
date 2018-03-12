/**
 * Created by jesseonolememen on 13/07/2017.
 */
var async = require('async'),
	keystone = require('keystone');

let Meal = keystone.list('Meal');
let MealReviews = keystone.list('MealReview');
let MealFavourite = keystone.list('MealFavourite');

exports.create = function(req, res) {
  const meal = new Meal.model(req.body);
  meal.save((err, results) => {
    if (err) {
      res.json({
        success: false,
        message: err.mesasge || 'Failed to save meal',
      });
    }

    res.json({
      success: true,
      results
    })
  })
}

exports.retrieve = function(req, res) {
  Meal.model.findById(req.params.id).exec((err, results) => {
    if (err) {
      res.json({
        success: false,
        message: err.mesasge || 'Failed to retrieve meal',
      });
    }

    res.json({
      success: true,
      results
    })
  });
}

exports.delete = function(req, res) {
  Meal.model.remove({ _id: req.params.id }).exec((err, results) => {
    if (err) {
      res.json({
        success: false,
        message: err.mesasge || 'Failed to delete meal',
      });
    }

    res.json({
      success: true,
      results
    })
  })
}

exports.list = function(req, res) {
  Meal.model.find().exec((err, results) => {
    if (err) {
      res.json({
        success: false,
        message: err.mesasge || 'Failed to list meals',
      });
    }

    res.json({
      success: true,
      results
    })
  })
}

exports.update = function(req, res) {
  Meal.model.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, results) => {
    if (err) {
      res.json({
        success: false,
        message: err.mesasge || 'Failed to update meal',
      });
    }

    res.json({
      success: true,
      results
    })
  })
}

exports.meals = function (req, res) {
	Meal.model.find().where('categories').in([req.params.id]).populate('options').populate('categories').populate('extras').exec(function (err, items) {
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

exports.getExtras = function (req, res) {
  Meal.model.find().where('isAnExtra', true).populate('categories').exec(function (err, items) {
    if (err) {
      res.json({ success: false, message: err.message || "Failed to fetch extras" });
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
