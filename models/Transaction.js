/**
 * Created by jesseonolememen on 21/08/2017.
 */
var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Transaction Model
 * ==================
 */

var Transaction = new keystone.List('Transaction', {
	autokey: { from: 'name', path: 'key', unique: true },
	nocreate: true,
	noedit: true,
	nodelete: true
});

Transaction.add({
	stripeToken: { type: String, required: false },
	braintreeNonce: { type: String, required: false },
	transactionDate: { type: Types.Date, required: false },
	status:  { type: String, required: false },
	paymentMethod: { type: Types.Select, required: true, initial: true, options: [
		{ value: 'PAY_PAL', label: 'PayPal' },
		{ value: 'CREDIT-CARD', label: 'Credit Card' },
		{ value: 'CASH', label: 'Cash' },
		{ value: 'APPLE_PAY', label: 'Apple Pay' },
		{ value: 'ANDROID_PAY', label: 'Android Pay' },
	] },
});


Transaction.register();
