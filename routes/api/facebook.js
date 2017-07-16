/**
 * Created by jesseonolememen on 16/07/2017.
 */
let async = require('async'),
	keystone = require('keystone'),
	axios = require('axios');

let jwt = require('jsonwebtoken');

exports.signIn = function(req, res, done) {
	let token = req.body.token;
	axios.get(`https://graph.facebook.com/v2.8/me?fields=id,name,email&access_token=${token}`).then(function (response) {
		let facebook_id = response.data.id;
		let name = response.data.name;
		let email = response.data.email;

		keystone.list('User').model.findOne({  email: email }).exec(function(err, users) {
			user = users[0];
			
			if (err) {
				return done( { success: false, error: err });
			}

			// if the user is found, then log them in
			if (user) {
				let names = user.name.split(' ');
				
				var tokenUser = {
					email: user.email,
					name: {
						first: names[0],
						last: names[1]
					},
					facebook: {
						ID: user._id,
					}
				};

				var token = jwt.sign(tokenUser, process.env.TOKEN_SECRET, {
					expiresIn: '7d' // expires in 7 days
				});

				res.json({success: true, token: token, error: null}); // user found, return that user
			} else {
				// if there is no user found with that facebook id, create them

				var newUser = new keystone.List('User');
				
				let names = name.split(' ');

				// set all of the facebook information in our user model
				newUser.facebook.ID = facebook_id; // set the users facebook id                   
				newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
				newUser.name.first = names[0]; // look at the passport user profile to see how names are returned
				newUser.name.last = names[1];
				newUser.email = email; // facebook can return multiple emails so we'll take the first

				// save our user to the database
				newUser.save(function (err) {
					if (err) {
						throw err;
					}

					var tokenUser = {
						email: newUser.email,
						name: {
							first: newUser.name.first,
							last: newUser.name.last
						},
						facebook: {
							ID: newUser.facebook.ID,
							token: newUser.facebook.token
						}
					};

					var token = jwt.sign(tokenUser, process.env.TOKEN_SECRET, {
						expiresIn: '7d' // expires in 7 days
					});

					// if successful, return the new user
					res.json({success: true, token: token, error: null});
				});
			}
		});
	}).catch(function(error) {
		return next(error);
	});
}
