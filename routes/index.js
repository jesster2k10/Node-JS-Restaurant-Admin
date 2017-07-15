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
var passport = require('passport');

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
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', function(req, res) {
		if (req.user) {
			return res.redirect('/keystone/');
		} else {
			return res.redirect('/keystone/signin');
		}
	});
	
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.get('/overview', routes.views.overview);

	app.post('/api/sign_in', middleware.signin);
	app.post('/api/sign_out', middleware.signout);
	
	app.patch('/api/carts/:id/products', routes.api.carts.addProductToCart);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// route for facebook authentication and login
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/',
			failureRedirect : '/'
		}));
	
	app.get('/api/meal-categories/:id/meals', routes.api.meals.meals);

	//Explicitly define which lists we want exposed
	restful.expose({
		Meal: {
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		MealCategory: {
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		Order: {
			populate: true,
			envelop: "results",
			methods: ["list", "retrieve", "create", "update", "remove"]
		},
		Cart: {
			populate: true,
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
		},
		User: {
			envelop: "results",
			methods: ["list", "retrieve"]
		}
	}).before("update remove create list retrieve", {
		Order: middleware.checkAuth,
		Cart: middleware.checkAuth,
	}).start();

};
