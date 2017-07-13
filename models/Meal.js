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

Meal.add({
	name: { type: Types.Text, required: true, initial: true },
	featuredImage: { type: Types.CloudinaryImage, required: true, initial: true },
	images: { type: Types.CloudinaryImages, required: true, initial: true},
	description: { type: Types.Textarea, required: true, initial: true },	
	categories: { type: Types.Relationship, ref: 'MealCategory', many: true, required: true, initial: true },
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
	] },
	isAvailable: { type: Types.Boolean, required: true, initial: true},
	isFeatured: { type: Types.Boolean, required: true, initial: true }
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
		] },	totalCost: { type: Types.Money, format: '€0,0.00', required: true, initial: true },
	chargesTax: { type: Types.Boolean, required: true, default: true },
	taxPercentage: { type: Types.Number, initial: true, required: false },
}, "Option One", {
	enableOptionOne: {type: Types.Boolean, required: false, default: false, initial: false},
	optionOne: {
		name: { type: Types.Text, required: false },
		cost: { type: Types.Money, format: '€0,0.00', required: false },
	}
}, "Option Two", {
	enableOptionTwo: {type: Types.Boolean, required: false, default: false, initial: false }, 
	optionTwo: {
		name: { type: Types.Text, required: false },
		cost: { type: Types.Money, format: '€0,0.00', required: false },
	}
}, "Option Three", {
		enableOptionThree: {type: Types.Boolean, required: false, default: false, initial: false},
		optionThree: {
			name: { type: Types.Text, required: false },
			cost: { type: Types.Money, format: '€0,0.00', required: false },
		}
	}

);

Meal.register();
