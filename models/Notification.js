/**
 * Created by jesseonolememen on 24/11/2017.
 */

var keystone = require('keystone'),
	Types = keystone.Field.Types;

var notifications = require('../helpers/notifications');

/**
 * Notification Model
 * ==========
 */

var Notification = new keystone.List('Notification', {
	autokey: { 
		path: 'slug',
		from: 'message',
		unique: true 
	}
});

Notification.add({
	message: {
		type: String,
		required: true,
		initial: true,
	},
	to: {
		type: Types.Select,
		required: true,
		initial: true,
		options: [
			{
				label: 'User',
				value: 'user',
			},
			{
				label: 'Admin',
				value: 'admin'
			}
		]
	},
	title: {
		type: String,
		required: false,
	},
	user: {
		type: Types.Relationship,
		ref: 'User',
		many: true,
		required: false,
	},
	order: {
		type: Types.Relationship,
		ref: 'Order',
		required: false,
		many: false,
	},
	review: {
		type: Types.Relationship,
		ref: 'MealReview',
		required: false,
		many: false,
	},
	reservation: {
		type: Types.Relationship,
		ref: 'Reservation',
		required: false,
		many: false,
	},
});

Notification.register();

Notification.schema.pre('save', function (next) {
	if (this.to === 'User') {
		let user = this.user;
		let message = this.message;
		let title = this.title;
		
		if (user.deviceIdentifier) {
			notifications.sendNotification(title, message, user.deviceIdentifier)
				.then(() => {
					next();
				})
				.catch((error) => {
					console.log(error);
					next();
				})
			;
		} else {
			next();
		}
	} else {
		next();
	}
});
