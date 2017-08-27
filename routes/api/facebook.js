/**
 * Created by jesseonolememen on 16/07/2017.
 */
let async = require('async'),
	keystone = require('keystone'),
	jwt = require('jsonwebtoken');

let User = keystone.list('User').model;

function updateUserWithFacebookDetails(res, updatedUser) {
	User.findOneAndUpdate({ email: updatedUser.email }, { $set: {facebook: updatedUser.facebook, name: updatedUser.name, profileImage: updatedUser.profileImage, password: updatedUser.password}})
		.exec(function (err, user) {
			if (err) {
				return res.json({ success: false, token: null, error: err.message });
			}
			
			if (!err && !user) {
				return res.json({ success: false, token: null, error: "An unexpected error occurred." });
			}
			
			if (!err && user) {
				let token = jwt.sign(user, process.env.TOKEN_SECRET, {
					expiresIn: '7d' // expires in 7 days
				});
				
				return res.json({ success: true, token: token, userId: user._id, error: null });
			}
		})
}

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
	let profileImage = `http://graph.facebook.com/${facebook_id}/picture`;

	keystone.list('User').model.findOne({ 'facebook.ID': facebook_id }).exec(function(err, user) {
			if (err) {
				return done( { success: false, error: err });
			}

			// if the user is found, then log them in
			if (user) {
				let tokenUser = {
					_id: user._id,
					email: user.email,
					name: {
						first: user.name.first,
						last: user.name.last
					},
					facebook: {
						ID: user.facebook.ID,
						token: user.facebook.token
					},
					profileImage: user.profileImage
				};

				let token = jwt.sign(tokenUser, process.env.TOKEN_SECRET, {
					expiresIn: '7d' // expires in 7 days
				});

				res.json({success: true, token: token, userId: user._id, error: null}); // user found, return that user
			} else {
				// if there is no user found with that facebook id, create them
				
				let user = new User({
					_id: user._id,
					facebook: {
						ID: facebook_id,
						token: fbUser.token
					},
					token: null,
					name: {
						first: firstName,
						last: lastName
					},
					email: email,
					isAdmin: false,
					profileImage: profileImage
				});


				user.save(function (err) {
					if (err) {
						if (err.code === 11000) {
							updateUserWithFacebookDetails(res, user);
						} else {
							return res.json({ success: false, token: null, error: err.message || "There was an issue logging in with Facebook" })
						}
					}
					
					if (!user && !err) {
						return res.json({ success: false, token: null, error: "There was an issue logging in with Facebook" })
					}
					
					if (user && !err) {
						let token = jwt.sign(user, process.env.TOKEN_SECRET, {
							expiresIn: '7d' // expires in 7 days
						});

						return res.json({ success: true, token: token, userId: user._id, error: null });
					}
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
