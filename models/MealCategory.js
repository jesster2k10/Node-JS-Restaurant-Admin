/**
 * Created by jesseonolememen on 06/06/2017.
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * MealCategory Model
 * ==================
 */

var MealCategory = new keystone.List('MealCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

MealCategory.add({
	name: { type: Types.Text, required: true, initial: true },
	excerpt: { type: Types.Text, required: true, initial: true },
	featuredImage: { type: Types.CloudinaryImage, required: true, initial: true }
});

MealCategory.relationship({ ref: 'Meal', path: 'meals', refPath: 'categories' });

MealCategory.register();
