/**
 * Created by jesseonolememen on 06/06/2017.
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Meal Model
 * ==========
 */

var Meal = new keystone.List('Meal', {
	autokey: { path: 'slug', from: 'title', unique: true }
});

Meal.add(
{
	name: { type: Types.Text, required: true, initial: true }, 
	isAnExtra: {
		type: Types.Boolean,
		required: false,
		initial: true,
		default: false,
	},
	featuredImage: { type: Types.CloudinaryImage, required: true, initial: true, dependsOn: { isAnExtra: false } },
	images: { type: Types.CloudinaryImages, required: true, initial: true, dependsOn: { isAnExtra: false } },
	description: { type: Types.Textarea, required: true, initial: true, dependsOn: { isAnExtra: false } },	
	categories: { type: Types.Relationship, ref: 'MealCategory', many: true, required: true, initial: true, dependsOn: { isAnExtra: false } },
	serves: { type: Types.Select, required: true, initial: true, options: [
		{ value: '1', label: '1' },
		{ value: '2', label: '2' },
		{ value: '3', label: '3' },
		{ value: '4', label: '4' },
		{ value: '5', label: '5' },
		{ value: '6', label: '6' },
		{ value: '7', label: '7' },
		{ value: '8', label: '8' },
		{ value: '9', label: '9' },
		{ value: '10', label: '10' },
		{ value: '10+', label: '10+' }
	], dependsOn: { isAnExtra: false } },
	isAvailable: { type: Types.Boolean, required: true, initial: true},
	isFeatured: { type: Types.Boolean, required: true, initial: true, dependsOn: { isAnExtra: false } },
	extras: {
		type: Types.Relationship,
		ref: 'Meal',
		many: true,
		required: false,
		initial: true,
		dependsOn: {
			isAnExtra: false,
		},
		filters: {
			isAnExtra: true,
		}
	}
}, "Cost", {
	currency: { type: Types.Select, required: true, initial: true, options: [
			{ value: 'USD', label: 'USD' },
			{ value: 'EUR', label: 'EUR' },
			{ value: 'GBP', label: 'GBP' },
			{ value: 'AUD', label: 'AUD' },
			{ value: 'CHF', label: 'CHF' },
			{ value: 'JPY', label: 'JPY' },
			{ value: 'CAD', label: 'CAD' },
			{ value: 'INR', label: 'INR' },
			{ value: 'NGN', label: 'NGN' },
		] },	
		totalCost: { type: Types.Money, format: '€0,0.00', required: true, initial: true },
	chargesTax: { type: Types.Boolean, required: true, default: true },
	taxPercentage: { type: Types.Number, initial: true, required: false },
},
"Options", {
		enableOptions: { type: Types.Boolean, required: false, initial: false, default: false,  dependsOn: { isAnExtra: false }},
		options: { type: Types.Relationship, ref: 'MealOption', many: true, initial: false,  dependsOn: { isAnExtra: false } },
	}
);

function empty( val ) {

	// test results
	//---------------
	// []        true, empty array
	// {}        true, empty object
	// null      true
	// undefined true
	// ""        true, empty string
	// ''        true, empty stringƒ
	// 0         false, number
	// true      false, boolean
	// false     false, boolean
	// Date      false
	// function  false

	if (val === undefined)
		return true;

	if (typeof (val) == 'function' || typeof (val) == 'number' || typeof (val) == 'boolean' || Object.prototype.toString.call(val) === '[object Date]')
		return false;

	if (val == null || val.length === 0)        // null or 0 length array
		return true;

	if (typeof (val) == "object") {
		// empty object

		var r = true;

		for (var f in val)
			r = false;

		return r;
	}

	return false;
}

Meal.relationship({ ref: 'MealReview', path: 'mealReviews', refPath: 'meal' });
Meal.defaultColumns = 'name, featuredImage, isAnExtra|20%, author|20%, publishedDate|20%';

Meal.schema.pre('validate', function(next) {
	if (this.enableOptions && empty(this.options) ){
		next(Error('At least one option is required if you click "enable options"'));
	}
	else {
		next();
	}
});

Meal.register();
