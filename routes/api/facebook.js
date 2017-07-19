/**
 * Created by jesseonolememen on 16/07/2017.
 */
let async = require('async'),
	keystone = require('keystone'),
	jwt = require('jsonwebtoken');

exports.signIn = function(req, res, done) {
	let fbUser = req.body.facebook_user;

	if (!(fbUser)) {
		res.json({ success: false, error: 'No user was found' });
		return;
	}
	
	let facebook_id = fbUser.id;
	let firstName = fbUser.first_name;
	let lastName = fbUser.last_name;
	let email = fbUser.email;

	keystone.list('User').model.findOne({  'email': email }).exec(function(err, user) {
			if (err) {
				return done( { success: false, error: err });
			}

			// if the user is found, then log them in
			if (user) {
				let tokenUser = {
					email: user.email,
					name: {
						first: user.name.first,
						last: user.name.last
					},
					facebook: {
						ID: user.facebook.ID,
						token: user.facebook.access_token
					}
				};

				let token = jwt.sign(tokenUser, process.env.TOKEN_SECRET, {
					expiresIn: '7d' // expires in 7 days
				});

				res.json({success: true, token: token, error: null}); // user found, return that user
			} else {
				// if there is no user found with that facebook id, create them

				keystone.createItems({
					User: {
						facebook: {
							ID: facebook_id,
							token: fbUser.token
						},
						name: {
							first: firstName,
							last: lastName
						},
						email: email,
						isAdmin: false
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
