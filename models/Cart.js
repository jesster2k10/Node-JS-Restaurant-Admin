/**
 * Created by jesseonolememen on 10/07/2017.
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Cart Model
 * ==========
 */

var Cart = new keystone.List('Cart', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Cart.add({
	products: { type: Types.Relationship, ref: 'Meal', many: true, required: true, initial: true },
	options: { type: Types.TextArray, many: true, required: false, initial: false, default: []},
	creationDate : { type: Types.Datetime, default: Date.now, initial: true, required: true }
});

Cart.register();
