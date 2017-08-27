/**
 * Created by jesseonolememen on 19/07/2017.
 */

let async = require('async'),
	keystone = require('keystone'),
	jwt = require('jsonwebtoken');

exports.signIn = function(req, res, done) {
	let googleUser = req.body.google_user;

	if (!(googleUser)) {
		res.json({ success: false, error: 'No user was found' });
		return;
	}
	
	console.log(googleUser);

	let profileImage = googleUser.image.url;
	let google_id = googleUser.id;
	let firstName = googleUser.name.givenName;
	let lastName = googleUser.name.familyName;
	let email = googleUser.emails[0].value;

	keystone.list('User').model.findOne({  'email': email }).exec(function(err, user) {
		if (err) {
			return done( { success: false, error: err });
		}

		// if the user is found, then log them in
		if (user) {
			let tokenUser = {
				email: user.email.toLowerCase(),
				name: {
					first: user.name.first,
					last: user.name.last
				},
				google: {
					ID: user.google.ID,
					token: user.google.token
				},
				profileImage: user.profileImage
			};

			let token = jwt.sign(tokenUser, process.env.TOKEN_SECRET, {
				expiresIn: '7d' // expires in 7 days
			});

			res.json({success: true, token: token, error: null}); // user found, return that user
		} else {
			// if there is no user found with that facebook id, create them

			keystone.createItems({
				User: {
					google: {
						ID: google_id,
						token: googleUser.token
					},
					name: {
						first: firstName,
						last: lastName
					},
					email: email,
					isAdmin: false,
					profileImage: profileImage
				}
			}, (err, status) => {
				stats && console.log(stats.message);
			});

			// let newUser = new UserModel.model({
			// 	facebook: {
			// 		ID: facebook_id,
			// 		token: fbUser.token
			// 	},
			// 	name: {
			// 		first: firstName,
			// 		last: lastName
			// 	},
			// 	email: email,
			// 	isAdmin: false
			// });

			// let tokenUser = {
			// 	email: newUser.email,
			// 	name: {
			// 		first: newUser.name.first,
			// 		last: newUser.name.last
			// 	},
			// 	facebook: {
			// 		ID: newUser.facebook.ID,
			// 		access_token: newUser.facebook.token
			// 	}
			// };
			//
			// let token = jwt.sign(tokenUser, process.env.TOKEN_SECRET, {
			// 	expiresIn: '7d' // expires in 7 days
			// });
			//
			// // if successful, return the new user
			// res.json({success: true, token: token, error: null});

			// save our user to the database
			// newUser.save(function (err) {
			// 	if (err) {
			// 		throw err;
			// 	}
			//
			// 	let tokenUser = {
			// 		email: newUser.email,
			// 		name: {
			// 			first: newUser.name.first,
			// 			last: newUser.name.last
			// 		},
			// 		facebook: {
			// 			ID: newUser.facebook.ID,
			// 			access_token: newUser.facebook.token
			// 		}
			// 	};
			//
			// 	let token = jwt.sign(tokenUser, process.env.TOKEN_SECRET, {
			// 		expiresIn: '7d' // expires in 7 days
			// 	});
			//
			// 	// if successful, return the new user
			// 	res.json({success: true, token: token, error: null});
			// });
		}
	});
}
