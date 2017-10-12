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
	autokey: { from: 'title', path: 'key', unique: true },
	noedit: true
});

MealReview.add({
	title: {
		type: String,
		required: false,
		initial: false,
	},
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
		required: false,
		initial: true,
	},
	meal: {
		type: Types.Relationship,
		ref: 'Meal',
		many: false,
		required: false,
		initial: true,
	},
	user: {
		type: Types.Relationship,
		ref: 'User',
		many: false,
		required: false,
		initial: true
	}
});

MealReview.defaultColumns = 'title, review, rating, created, user';

MealReview.register();
