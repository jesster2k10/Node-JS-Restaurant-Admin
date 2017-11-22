/**
 * Created by jesseonolememen on 03/11/2017.
 */
let keystone = require('keystone'),
	Types = keystone.Field.Types;

let StoreNotification = new keystone.List('StoreNotification', {
	autokey: { path: 'slug', from: 'title', unique: true },
	hidden: true,
});

StoreNotification.add({
	message: {
		type: String,
		required: true,
		initial: true,
	},
	date: {
		type: Types.Datetime,
		required: true,
		initial: true,
	},
	order: {
		type: Types.Relationship,
		ref: 'Order',
		many: false,
		required: false,
	},
	reservation: {
		type: Types.Relationship,
		ref: 'Reservation',
		many: false,
		required: false,
	},
	type: {
		type: Types.Select,
		required: true,
		initial: true,
		options: [
			{ 
				value: 0,
				label: 'New Order',
			},
			{
				value: 1,
				label: 'New Reservation',
			},
			{
				value: 2,
				label: 'Cancelled Order',
			},
			{
				value: 3,
				label: 'Cancelled Reservation'
			}
		]
	}
});

StoreNotification.schema.pre('validate', function(next) {
	if (this.order && this.reservation){
		next(Error('You can only have either/or a reservation or order.'));
	}
	else {
		next();
	}
});

StoreNotification.register();
