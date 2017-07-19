/**
 * Created by jesseonolememen on 11/07/2017.
 */

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var keystone = require('keystone');
var jwt = require('jsonwebtoken');

const User = new keystone.List('User');

const transformFacebookProfile = (profile) => ({
	name: profile.name,
	avatar: profile.picture.data.url,
});

// Transform Google profile into user object
const transformGoogleProfile = (profile) => ({
	name: profile.displayName,
	avatar: profile.image.url,
});


module.exports = function (passport) {

	// used to serialize the user
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		keystone.list('User').model.findOne({ id: id }).exec(function(err, user) {
			done(err, user);
		});
	});

	/************/
	/* FACEBOOK */
	/************/
	
	passport.use(new FacebookStrategy({
		clientID: process.env.FACEBOOK_CLIENT_ID,
		clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
		callbackURL: process.env.FACEBOOK_CALLBACK_URL
	},
		
		// facebook will send the token and profile
		function (token, refreshToken, profile, done) {
			process.nextTick(function () {
				keystone.list('User').model.findOne({  email: profile.emails[0].value }).exec(function(err, user) {
					// if there is an error, stop everything and return that
					// ie an error connecting to the database
					if (err) {
						return done( { success: false, error: err });
					}
					
					// if the user is found, then log them in
					if (user) {
						var tokenUser = {
							email: user.email,
							name: {
								first: user.name.first,
								last: user.name.last
							},
							facebook: {
								ID: user.facebook.ID,
								token: user.facebook.token
							}
						};

						var token = jwt.sign(tokenUser, process.env.TOKEN_SECRET, {
							expiresIn: '7d' // expires in 7 days
						});
						
						return done(null, {success: true, token: token, error: null}); // user found, return that user
					} else {
						// if there is no user found with that facebook id, create them

						var newUser = new keystone.List('User').model;

						// set all of the facebook information in our user model
						newUser.facebook.ID     = profile.id; // set the users facebook id                   
						newUser.facebook.token  = token; // we will save the token that facebook provides to the user                    
						newUser.name.first  	= profile.name.givenName; // look at the passport user profile to see how names are returned
						newUser.name.last 		= profile.name.familyName;
						newUser.email 			= profile.emails[0].value; // facebook can return multiple emails so we'll take the first

						// save our user to the database
						newUser.save(function(err) {
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
							return done(null, { success: true, token: token, error: null });
						});
					}
				});
			})
		}
		
	))
}
