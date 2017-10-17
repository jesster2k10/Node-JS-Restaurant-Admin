/**
 * Created by jesseonolememen on 16/10/2017.
 */
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Reservation Model
 * ==========
 */

var Reservation = new keystone.List('Reservation', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Reservation.add({
	table: {
		type: Types.Relationship,
		ref: 'Table',
		many: false,
		required: true,
		initial: true
	},
	guests: {
		type: Types.Number,
		required: true,
		initial: true
	},
	date: {
		type: Types.Date,
		required: true,
		initial: true
	},
	time: {
		type: Types.Datetime,
		required: true,
		initial: true
	},
	code: {
		type: String,
		required: true,
		initial: true,
		noedit: true
	}
}, 'Reserver Details', {
	reserver: {
		name: {
			type: Types.Name,
			required: false,
			initial: false
		},
		phone: {
			type: String,
			required: false,
			initial: false
		},
		email: {
			type: Types.Email,
			required: false, 
			initial: false
		},
		user: {
			type: Types.Relationship,
			ref: 'User',
			many: false,
			required: false,
			initial: true
		}
	}
});

Reservation.register();
