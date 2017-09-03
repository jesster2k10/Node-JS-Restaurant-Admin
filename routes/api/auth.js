/**
 * Created by jesseonolememen on 19/07/2017.
 */
var jwt = require('jsonwebtoken');
var keystone = require('keystone');
var client = require('redis').createClient(process.env.REDIS_URL);

const BLACKLISTED_TOKENS_KEY = 'blacklisted_tokens';

// middleware
exports.checkUserMatches = function checkUserMatches(req, res, next) {
	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	if (token) {
		jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
			console.log(decoded);
			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				client.sismember(BLACKLISTED_TOKENS_KEY, token, function (err, reply) {
					if (err) {
						return res.json({ success: false, message: 'Failed to authenticate token.' });
					} else {
						if (reply == 0) {
							let decodedObject = decoded._doc ? decoded._doc : decoded;
							
							if (decodedObject._id != req.params.id) {
								return res.json({ success: false, message: 'This is not the right user' })
							} else {
								req.decoded = decoded;
								next();
							}
						} else {
							return res.json({ success: false, message: 'Failed to authenticate token.' });
						}
					}
				});
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
};

exports.checkAuth = function checkAuth(req, res, next) {
	// // you could check user permissions here too
	// if (req.user) return next();
	// return res.status(403).json({ 'error': 'no access' });
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
			if (err) {
				client.sismember(BLACKLISTED_TOKENS_KEY, token, function (err, reply) {
					if (reply == 1) {
						client.srem(BLACKLISTED_TOKENS_KEY, token, function (err, reply) {
							if (err) {
								console.log('Failed to remove black listed token with error' + err.message);
							} else {
								console.log('Removed member')
							}
						})
					}
				});
				
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				client.sismember(BLACKLISTED_TOKENS_KEY, token, function (err, reply) {
					if (err) {
						return res.json({ success: false, message: 'Failed to authenticate token.' });
					} else {
						if (reply == 0) {
							req.decoded = decoded;
							next();
						} else {
							return res.json({ success: false, message: 'Failed to authenticate token.' });
						}
					}
				});
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
};

exports.verify = function verify(req, res) {
	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	console.log(token)
	
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, process.env.TOKEN_SECRET, function(err, decoded) {
			if (err) {
				client.sismember(BLACKLISTED_TOKENS_KEY, token, function (err, reply) {
					if (reply == 1) {
						client.srem(BLACKLISTED_TOKENS_KEY, token, function (err, reply) {
							if (err) {
								console.log('Failed to remove black listed token with error' + err.message);
							} else {
								console.log('Removed member')
							}
						})
					}
				});
				
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				req.decoded = decoded;
				client.sismember(BLACKLISTED_TOKENS_KEY, token, function (err, reply) {
					if (err) {
						return res.json({ success: true, decoded });
					} else {
						return res.json({ success: reply != 1, decoded: reply != 1 ? decoded : null  });
					}
				});
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
};

exports.signin = function signin(req, res) {
	console.log('sign in');
	console.log(req.body)
	
	if (!req.body.username || !req.body.password) {
		return res.json({ success: false, error: 'The credentials that you entered were valid or missing.' });
	}

	keystone.list('User').model.findOne({ email: req.body.username.toLowerCase() }).exec(function(err, user) {
		if (err || !user) {
			return res.json({
				success: false,
				session: false,
				token: null,
				message: (err && err.message ? err.message : false) || 'No account was found with the details you entered.'
			});
		}

		keystone.session.signin({ email: user.email, password: req.body.password }, req, res, function(user) {
			let tokenUser = {
				_id: user._id,
			};
			
			Object.keys(user).forEach(key => {
				if (key != '_id') {
					tokenUser[key] = user[key]
				}
			})
			
			var token = jwt.sign(tokenUser, process.env.TOKEN_SECRET, {
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
				token: null,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});

		});

	});
};

// you'll want one for signout too
exports.signout = function signout(req, res) {
	console.log(req.body)
	let token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (!token) return res.json({ success: false, error: 'No token was found' });
	
	client.sadd(BLACKLISTED_TOKENS_KEY, token, function(err, reply) {
		if (!err) {
			keystone.session.signout(req, res, function () {
				res.json({'signed_out': true, error: null });
			});
		} else {
			res.json({ 'signed_out': false, error: err });
		}
	});
};

