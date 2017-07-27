/**
 * Created by jesseonolememen on 06/06/2017.
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * MealCategory Model
 * ==================
 */

var MealOption = new keystone.List('MealOption', {
	autokey: { from: 'name', path: 'key', unique: true },
});

MealOption.add({
	name: { type: Types.Text, required: true, initial: true },
	price: { type: Types.Money, required: true, initial: true, unique: false },
	meal: { type: Types.Relationship, ref: 'Meal', many: false, required: true, initial: true },
});

MealOption.relationship({ ref: 'Meal', path: 'meals', refPath: 'options' });

MealOption.register();
