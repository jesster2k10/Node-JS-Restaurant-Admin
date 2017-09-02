/**
 * Created by jesseonolememen on 02/09/2017.
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * MealReview Model
 * ==================
 */

let MealReview = new keystone.List('MealReview', {
	autokey: { from: 'name', path: 'key', unique: true },
	noedit: true
});

MealReview.add({
	review: {
		type: String,
		required: true,
		initial: true,
	},
	rating: {
		note: 'Max rating is 5.0',
		type: Types.Number,
		required: true,
		initial: true
	},
	created: {
		type: Types.Datetime,
		required: true,
		initial: true,
	},
	meal: {
		type: Types.Relationship,
		ref: 'Meal',
		many: false,
		required: true,
		initial: false,
	},
	user: {
		type: Types.Relationship,
		ref: 'User',
		many: false,
		required: false,
		initial: false
	}
});

MealReview.relationship({ ref: 'User', path: 'users', refPath: 'user' });
MealReview.relationship({ ref: 'Meal', path: 'meals', refPath: 'meal' });

MealReview.defaultColumns = 'review, rating, created, user';

MealReview.register();
