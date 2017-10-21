var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true, hidden: true, select: false },
	profileImage: { type: Types.CloudinaryImage, initial: false, required: false, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png' },
	addresses: { type: Types.Relationship, ref: 'Address', required: false, many: true, initial: false, }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
}, 'Social Accounts', {
	facebook: {
		ID: { type: String, required: false },
		token: { type: String, required: false }
	},
	google: {
		ID: { type: String, required: false },
		token: { type: String, required: false }
	}
}, 'Other', {
	stripe: {
		customerID: { type: String, required: false },
	}
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Relationships
 */
User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });
User.relationship({ ref: 'Order', path: 'orders', refPath: 'user' });
User.relationship({ ref: 'MealReview', path: 'mealReviews', refPath: 'user' });
User.relationship({ ref: 'Address', path: 'addresses', refPath: 'user' });


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin, profileImage';
User.register();
