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
var helper = require('../helpers/orders');
var info = require('../helpers/information');
var importRoutes = keystone.importer(__dirname);

// Pass your keystone instance to the module
var restful = require('restful-keystone')(keystone);
var jwt = require('jsonwebtoken');
var apicache = require('apicache');
var redis = require('redis');

// create cache instance
const cacheWithRedis = apicache
                      .options({ redisClient: redis.createClient(process.env.REDIS_URL) })
                      .middleware

const cache = cacheWithRedis('5 minutes');

// import tokens
//var passport = require('passport');

// Common Middleware
keystone.pre('routes', middleware.initErrorHandlers);
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
keystone.set('404', function(req, res, next) {
	res.status(404).json({
		success: false,
		message: 'Requested resource not found!'
	});
});

// Handle other errors
keystone.set('500', function(err, req, res, next) {
	var title, message;
	if (err instanceof Error) {
		message = err.message;
		err = err.stack;
	}
	res.status(400).json({
		success: false,
		error: message
	})
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
	
	app.all('/api/*', middleware.setCors);
	app.options('/api*', function(req, res) { res.sendStatus(200); });
	
	app.get('/control_panel', routes.controlPanel.panel);
	app.get('/control_panel/login', routes.controlPanel.login);
	
	app.post('/control_panel/login', routes.controlPanel.login.signin);
	app.post('/control_panel/restaurant/update', middleware.onlyNotEmpty, routes.controlPanel.preferences.update)
	app.get('/control_panel/preferences', routes.controlPanel.preferences.view);
	app.get('/control_panel/restaurant-info', routes.controlPanel.info);
	app.put('/control_panel/api/restaurant-info', info.update);
	app.get('/control_panel/preferences-generate', function (req, res) {
		const token = jwt.sign({ user: req.user }, process.env.TOKEN_SECRET, {
			expiresIn: '2629743m' // 5 years
		});
		res.render('preferences', { ios: true, name: 'iOS App Preferences', user: req.user, token: token })
	});

	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.get('/gallery', routes.views.gallery);
	app.get('/overview', routes.views.overview);
	
	// Carts

	app.get('/api/cart/:id', routes.api.carts.getCart);
	app.patch('/api/carts/:id/products', routes.api.carts.addProductToCart);
	app.delete('/api/carts/:id/products', routes.api.carts.removeProductFromCart);
	app.route('/api/carts/:id/products/all').get(routes.api.auth.checkAuth, routes.api.carts.clearCart);
	
	// Meal Reviews
	app.route('/api/meal-reviews/:id/').get(cache, routes.api.meals.getReviews);
	
	// Order Fulfill
	app.route('/api/orders/:id/fullfill').post(routes.api.auth.checkIsAdmin, routes.api.orders.fullfillOrder);
	
	// Auth
	app.post('/api/auth/facebook', routes.api.facebook.signIn);
	app.post('/api/auth/google', routes.api.google.signIn);
	
	app.post('/api/auth/session/verify', routes.api.auth.verify);
	app.post('/api/auth/session/create',  routes.api.auth.signin);
	app.delete('/api/auth/session/delete', routes.api.auth.signout);

  app.get('/api/extras', routes.api.meals.getExtras);

  // Panel
  app.route('/api/panel/info').get(routes.api.auth.checkIsAdmin, routes.api.panel.getInfo);
	
  // Category
	app.route('/api/meal-categories/:id/meals').get([routes.api.auth.checkAuth, cache], routes.api.meals.meals);
	
	app.route('/api/orders/user/:id').get(routes.api.auth.checkAuth, routes.api.checkout.getOrdersForUser);
	app.route('/api/meal-favourites/user/:id').get(routes.api.auth.checkAuth, routes.api.meals.getFavouritesForUser);
	
	app.route('/api/addresses/user/:id').get(routes.api.auth.checkUserMatches, routes.api.auth.getAddress);
	
	app.route('/api/payments/').post(routes.api.auth.checkAuth, routes.api.payments.makePayment);
	app.route('/api/payments/braintree/').post(routes.api.auth.checkAuth, routes.api.payments.Braintree.makePayment);
	app.route('/api/payments/braintree/client_token').post(routes.api.auth.checkAuth, routes.api.payments.Braintree.generateClientToken);
	
	app.route('/api/payments/customer/')
		.get(routes.api.auth.checkAuth, routes.api.payments.getCustomer)
		.post(routes.api.auth.checkAuth, routes.api.payments.createCustomer);
	
	app.route('/api/payments/customer/charge').post(routes.api.auth.checkAuth, routes.api.payments.chargeCustomer);
	app.route('/api/payments/customer/cards').get(routes.api.auth.checkAuth, routes.api.payments.getPaymentCards);

	//Explicitly define which lists we want exposed
	restful.expose({
		Address: {
			populate: ["user"],
			envelop: "results",
			methods: ["retrieve", "create", "update", "remove"]
		},
		Meal: {
			populate: ["options", "extras", "categories", "create"],
			methods: ["list", "retrieve", "remove", "update", "create"],
			filter: {
				isAnExtra: false,
			},
			envelop: "results",
		},
		MealCategory: {
			envelop: "results",
			methods: ["list", "retrieve", "create", "update", "remove"]
		},
		MealOption: {
			envelop: "results",
			methods: ["list", "retrieve"]
		},
		MealReview: {
			envelop: "results",
			methods: ["list", "retrieve", "create", "remove"],
			populate: ["user", "meal"],
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
			methods: ["list", "retrieve", "create", "update", "remove"]
		},
		PostCategory: {
			envelop: "results",
			methods: ["list", "retrieve", "create", "update", "remove"]
		},
		User: {
			envelop: "results",
			populate: ["addresses"],
			show : ["_id", "email", "isAdmin", "name"],
			methods: ["retrieve", "create", "update", "remove", "list"]
		},
		Transaction: {
			envelop: "results",
			methods: ["list", "retrieve", "create", "update"]
		},
		Photo: {
			envelop: "results",
			methods: ["list", "retrieve", "create", "update", "remove"]
		},
		MealFavourite: {
			envelop: 'results',
			methods: ['list', 'retrieve', 'create', 'remove']
		},
		Reservation: {
			envelop: "results",
			methods: ["list", "retrieve", "create", "update", "remove"]
		},
		Table: {
			envelop: "results",
			methods: ["list"]
		},
		Notification: {
			envelop: "results",
			methods: ["create", "list", "retrieve"],
		}
	}).before("update remove create list retrieve", {
		Order: routes.api.auth.checkAuth,
		Transaction: routes.api.auth.checkAuth,
		Post: routes.api.auth.checkAuth,
		MealCategory: routes.api.auth.checkAuth,
		MealReview: routes.api.auth.checkAuth,
		Photo: routes.api.auth.checkAuth,
		MealFavourite: routes.api.checkAuth,
		Address: routes.api.checkAuth,
	}).before({
		User: {
			retrieve: routes.api.auth.checkUserMatches,
			update: routes.api.auth.checkUserMatches,
			remove: routes.api.auth.checkUserMatches,
		},
		Meal: {
			create: routes.api.auth.checkIsAdmin,
			remove: routes.api.auth.checkIsAdmin,
			update: routes.api.auth.checkIsAdmin,
		},
		MealCategory: {
			create: routes.api.auth.checkIsAdmin,
			remove: routes.api.auth.checkIsAdmin,
			update: routes.api.auth.checkIsAdmin,
		},
		Post: {
			create: routes.api.auth.checkIsAdmin,
			remove: routes.api.auth.checkIsAdmin,
			update: routes.api.auth.checkIsAdmin,
		},
		Photo: {
			create: routes.api.auth.checkIsAdmin,
			remove: routes.api.auth.checkIsAdmin,
			update: routes.api.auth.checkIsAdmin,
		},
		MealReview: {
			remove: routes.api.auth.checkIsAdmin,
		}
	}).before('retrieve list', {
		Post: cache,
		Meal: cache,
		PostCategory: cache,
		Gallery: cache,
		MealCategory: cache,
		MealReview: cache,
		MealOption: cache,
		Photo: cache,
	})
	.after({
		Meal: {
			list: function(req, res, next) {
				if (res.locals.body) {
					let arr = res.locals.body.results;
					
					res.status(200).json({
						results: arr,
						success: true,
					})
				} else {
					res.send(res.locals.status, res.locals.body);
				}
			}
		}
	}).start();

};
