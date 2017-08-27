/**
 * Created by jesseonolememen on 21/08/2017.
 */
var keystone = require('keystone');

var User = keystone.list('User');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;


	// Render the view
	view.render('login');
};

exports.signin = function signin(req, res) {
	console.log('sign in');

	if (!req.body.username || !req.body.password) {
		return res.json({ success: false, error: 'Please make sure you entered a username or a password.' });
	}

	keystone.list('User').model.findOne({ email: req.body.username }).exec(function(err, user) {

		if (err || !user) {
			return res.json({
				success: false,
				error: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		}

		keystone.session.signin({ email: user.email, password: req.body.password }, req, res, function(user) {
			res.send({ success: true });
		}, function(err) {
			return res.send({
				success: false,
				error: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		});

	});
};
