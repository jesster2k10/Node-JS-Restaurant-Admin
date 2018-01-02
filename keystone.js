// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config();

// Require keystone
var keystone = require('keystone');
var passport = require('passport');

var socket = require('socket.io');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
	'name': 'Your Restaurant ',
	'brand': 'Your Restaurant ',

	'sass': 'public',
	'static': 'public',
	//'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'pug',

	'emails': 'templates/emails',

	'signin logo': ['../images/logo.png', 200, 200],

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'port': process.env.port || 3001,
	'mongo': process.env.MONGODB_URI
});

keystone.set('cors allow origin', true);
keystone.set('cors allow methods', true);
keystone.set('cors allow headers', true);

keystone.pre('routes', passport.initialize());
keystone.pre('routes', passport.session());

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

// Load your project's Routes
keystone.set('routes', require('./routes'));


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	posts: ['posts', 'post-categories'],
	meals: ['meals', 'meal-categories', 'meal-options'],
	orders: 'orders',
	carts: 'carts',
	galleries: 'galleries',
	photos: 'photos',
	users: 'users',
});

// Start Keystone to connect to your database and initialise the web server


if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
	console.log('----------------------------------------'
	+ '\nWARNING: MISSING MAILGUN CREDENTIALS'
	+ '\n----------------------------------------'
	+ '\nYou have opted into email sending but have not provided'
	+ '\nmailgun credentials. Attempts to send will fail.'
	+ '\n\nCreate a mailgun account and add the credentials to the .env file to'
	+ '\nset up your mailgun integration');
}

keystone.start({
	onStart: function () {
		var hserver = keystone.httpServer;
		var io = keystone.set('io', socket.listen(hserver)).get('io');

		io.on('connection', function (socket) {
			console.log(`Socket connected ${socket.id}`);
			
			socket.on('NEW_ORDER', function (data) {
				console.log('new order');
			})
		});
	}
});
