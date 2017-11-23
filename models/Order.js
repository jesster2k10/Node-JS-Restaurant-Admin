/**
 * Created by jesseonolememen on 10/07/2017.
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Order Model
 * ==========
 */

var Order = new keystone.List('Order', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Order.add({
	ordererName: { type: Types.Name, required: false, initial: true },
	billingName: { type: Types.Name, required: false, initial: true },
	billingAddress: { type: Types.Location, defaults: { country: 'Ireland'}, required: false, initial: true },
	deliveryAddress: { type: Types.Location, defaults: { country: 'Ireland'}, required: false, initial: true },
	total: { type: Types.Number, required: false, initial: true },
	delivery: { type: Types.Number, required: false, initial: true },
	orderDate: { type: Types.Datetime, default: Date.now, required: false, initial: false },
	orderNote: { type: String, required: false },
	products: { type: Types.Relationship, ref: 'Meal', many: true, initial: true },
	transaction: { type: Types.Relationship, ref: 'Transaction', many: false, initial: false, required: false },
	user: { type: Types.Relationship, ref: 'User', required: false, many: false, initial: false },
	status: { type: Types.Select, required: false, initial: false, options: [
		{ value: 'Completed', label: 'Completed' },
		{ value: 'Delivered', label: 'Delivered' },
		{ value: 'Failed', label: 'Failed' },
		{ value: 'Cancelled', label: 'Cancelled' },
	] },
	type: { type: String, required: false }
});

Order.register();
