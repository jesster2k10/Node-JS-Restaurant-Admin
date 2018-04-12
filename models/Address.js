/**
 * Created by jesseonolememen on 21/10/2017.
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Address Model
 * ==========
 */

var Address = new keystone.List('Address', {
	hidden: true,
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Address.add({
	address: {
		type: Types.Location,
		required: true,
		initial: true,
	},
	name: {
		type: Types.Name,
		required: true,
		initial: true,
	},
	user: {
		type: Types.Relationship,
		ref: 'User',
		required: true,
		initial: false,
	},
	phone: {
		type: Types.String,
		required: false,
	},
	email: {
		type: Types.Email,
		required: false,
	},
});

Address.register();
