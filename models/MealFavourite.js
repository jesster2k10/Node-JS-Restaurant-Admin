/**
 * Created by jesseonolememen on 03/09/2017.
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * MealFavourite Model
 * ==================
 */

let MealFavourite = new keystone.List('MealFavourite', {
	noedit: true,
	hidden: true
});

MealFavourite.add({
	created: {
		type: Types.Datetime,
		required: false,
		initial: true,
		default: Date.now()
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

MealFavourite.defaultColumns = 'title, review, rating, created, user';

MealFavourite.register();
