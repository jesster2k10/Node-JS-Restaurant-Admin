/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Pass your keystone instance to the module
var restful = require('restful-keystone')(keystone);

// import tokens
var jwt = require('jsonwebtoken');

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function(req, res, next) {
	res.notfound();
});

// Handle other errors
keystone.set('500', function(err, req, res, next) {
	var title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	res.err(err, title, message);
});

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
};

// middleware
function checkAuth(req, res, next) {
	// // you could check user permissions here too
	// if (req.user) return next();
	// return res.status(403).json({ 'error': 'no access' });
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}
}

function signin(req, res) {

	if (!req.body.username || !req.body.password) return res.json({ success: false });

	keystone.list('User').model.findOne({ email: req.body.username }).exec(function(err, user) {

		if (err || !user) {
			return res.json({
				success: false,
				session: false,
				token: nil,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		}

		keystone.session.signin({ email: user.email, password: req.body.password }, req, res, function(user) {
			var token = jwt.sign(user, process.env.TOKEN_SECRET, {
				expiresIn: '7d' // expires in 7 days
			});
			
			return res.json({
				success: true,
				session: true,
				token: token,
				date: new Date().getTime(),
				userId: user.id
			});

		}, function(err) {

			return res.json({
				success: true,
				session: false,
				token: nil,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});

		});

	});
}

// you'll want one for signout too
function signout(req, res) {
	keystone.session.signout(req, res, function () {
		res.json({'signed_out': true});
	});
}

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.get('/overview', routes.views.overview);

	app.post('/api/sign_in', signin);
	app.post('/api/sign_out', signout);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

	//Explicitly define which lists we want exposed
	restful.expose({
		Product: {
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		ProductCategory: {
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		Order: {
			envelop: "results",
			methods: ["list", "retrieve", "create", "update", "remove"]
		},
		Cart: {
			envelop: "results",
			methods: ["list", "retrieve", "create", "update", "remove"]
		},
		Gallery: {
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		Post: {
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		PostCategory: {
			envelop: "results",
			methods: ["list", "retrieve"]
		}
	}).before("update remove create list retrieve", {
		Order: checkAuth,
		Cart: checkAuth
	}).start();

};
