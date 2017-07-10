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
	ordererName: { type: Types.Name, required: true, initial: true },
	billingName: { type: Types.Name, required: true, initial: true },
	billingAddress: { type: Types.Location, defaults: { country: 'Ireland'}, required: true, initial: true },
	deliveryAddress: { type: Types.Location, defaults: { country: 'Ireland'}, required: true, initial: true },
	total: { type: Types.Money, format: '€0,0.00', required: true, initial: true },
	chargesTax: { type: Types.Boolean, default: true, required: true, initial: false },
	tax: { type: Types.Money, format: '€0,0.00', required: false },
	orderDate: { type: Types.Datetime, default: Date.now, required: true, initial: false },
	orderNote: { type: String, required: false },
	products: { type: Types.Relationship, ref: 'Product', many: true, initial: true }
});

Order.register();
