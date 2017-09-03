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
		required: true,
		initial: true,
	},
	meal: {
		type: Types.Relationship,
		ref: 'Meal',
		many: false,
		required: true,
		initial: true,
	},
	user: {
		type: Types.Relationship,
		ref: 'User',
		many: false,
		required: true,
		initial: true
	}
});

MealFavourite.defaultColumns = 'title, review, rating, created, user';

MealFavourite.register();
