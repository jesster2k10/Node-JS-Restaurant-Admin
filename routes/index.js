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
var restaurant = require('../helpers/restaurant');
var importRoutes = keystone.importer(__dirname);

// Pass your keystone instance to the module
var restful = require('restful-keystone')(keystone);

// import tokens
//var passport = require('passport');

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
	api: importRoutes('./api'),
	controlPanel: importRoutes('./controlPanel')
};

// Setup Route Bindings
exports = module.exports = function (app) {
	//Views
	app.get('/', function(req, res) {
		if (req.user) {
			return res.redirect('/control_panel');
		} else {
			return res.redirect('/control_panel/login');
		}
	});
	
	app.get('/control_panel', routes.controlPanel.panel);
	
	app.get('/control_panel/login', routes.controlPanel.login);
	app.post('/control_panel/login', routes.controlPanel.login.signin);
	
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.get('/overview', routes.views.overview);
	
	app.get('/api/cart/:id', routes.api.carts.getCart);
	app.patch('/api/carts/:id/products', routes.api.carts.addProductToCart);
	app.delete('/api/carts/:id/products', routes.api.carts.removeProductFromCart);

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

	// =====================================
	// FACEBOOK ROUTES =====================
	// =====================================
	// // route for facebook authentication and login
	// app.get('/api/auth/facebook', passport.authenticate('facebook'));
	//
	app.post('/api/auth/facebook', routes.api.facebook.signIn);
	app.post('/api/auth/google', routes.api.google.signIn);
	
	app.post('/api/auth/session/verify', routes.api.auth.verify);
	app.post('/api/auth/session/create',  routes.api.auth.signin);
	app.delete('/api/auth/session/delete', routes.api.auth.signout);
	
    //
	// // handle the callback after facebook has authenticated the user
	// app.get('/api/auth/facebook/callback',
	// 	passport.authenticate('facebook', { failureRedirect: '/auth/facebook' }),
	// 	// Redirect user back to the mobile app using Linking with a custom protocol OAuthLogin
	// 	(req, res) => res.redirect('restaurant://login?user=' + JSON.stringify(req.user)));p
	//
	app.route('/api/meal-categories/:id/meals').get(routes.api.auth.checkAuth, routes.api.meals.meals);
	app.route('/api/orders/user/:id').get(routes.api.auth.checkAuth, routes.api.checkout.getOrdersForUser);

	//Explicitly define which lists we want exposed
	restful.expose({
		Meal: {
			populate: ["options"],
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		MealCategory: {
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		MealOption: {
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		Order: {
			populate: ["products", "transaction"],
			envelop: "results",
			methods: ["list", "retrieve", "create", "update", "remove"]
		},
		Cart: {
			populate: ["products", "options"],
			envelop: "results",
			methods: ["list", "retrieve", "create", "update", "remove"]
		},
		Gallery: {
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		Post: {
			envelop: "results",
			populate: ["categories", "author"],
			methods: ["list", "retrieve"]
		},
		PostCategory: {
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		User: {
			envelop: "results",
			show : ["_id", "email", "isAdmin", "name"],
			methods: ["retrieve", "create", "update", "remove"]
		},
		Transaction: {
			envelop: "results",
			methods: ["list", "retrieve", "create", "update"]
		}
	}).before("update remove create list retrieve", {
		Order: routes.api.auth.checkAuth,
		Cart: routes.api.auth.checkAuth,
		Transaction: routes.api.auth.checkAuth,
		Post: routes.api.auth.checkAuth,
		MealCategory: routes.api.auth.checkAuth
	}).before({
		User: {
			retrieve: routes.api.auth.checkUserMatches,
			update: routes.api.auth.checkUserMatches,
			remove: routes.api.auth.checkUserMatches,
		}
	}).start();

};
