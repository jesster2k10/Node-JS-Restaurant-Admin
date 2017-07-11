/**
 * Created by jesseonolememen on 06/06/2017.
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Product Model
 * ==========
 */

var Product = new keystone.List('Product', {
	autokey: { path: 'slug', from: 'title', unique: true }
});

Product.add({
	name: { type: Types.Text, required: true, initial: true },
	featuredImage: { type: Types.CloudinaryImage, required: true, initial: true },
	images: { type: Types.CloudinaryImages, required: true, initial: true},
	totalCost: { type: Types.Money, format: '€0,0.00', required: true, initial: true },
	chargesTax: { type: Types.Boolean, required: true, default: true },
	tax: { type: Types.Money, format: '€0,0.00', required: false },
	description: { type: Types.Textarea, required: true, initial: true },	
	categories: { type: Types.Relationship, ref: 'ProductCategory', many: true, required: true, initial: true },
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
});

Product.register();
