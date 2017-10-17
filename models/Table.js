/**
 * Created by jesseonolememen on 16/10/2017.
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Table Model
 * ==========
 */

var Table = new keystone.List('Table', {
	map: { name: 'number' },
});

Table.add({
	number: {
		type: Types.Number,
		required: true,
		initial: true
	},
	seats: {
		type: Types.Number,
		required: true,
		initial: true
	},
});

Table.register();
