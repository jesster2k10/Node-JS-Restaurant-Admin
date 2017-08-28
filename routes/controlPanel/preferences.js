/**
 * Created by jesseonolememen on 28/08/2017.
 */
var keystone = require('keystone');
var restaurant = require('../../helpers/restaurant');
var RestaurantInformation = keystone.list('RestaurantInformation');

exports.update = function (req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	
	RestaurantInformation.model.findOneAndUpdate({key: 2}, req.modified)
		.exec((err, updated) => {
			if (err) {
				console.log('Error updating');
				view.render('info', { error: err.message, success: false, updated: null });
			} else {
				if (updated) {
					view.render('info', { error: null, success: true, updated });
				} else {
					view.render('info', { error: null, success: false, updated });
				}
			}
		})
};

exports.view = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	
	view.render('preferences');
};
