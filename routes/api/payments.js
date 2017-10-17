/**
 * Created by jesseonolememen on 13/10/2017.
 */
var async = require('async'),
	keystone = require('keystone'),
	payments = require('../../helpers/payments');

let User = keystone.list('User');

exports.createCustomer = function (req, res) {
	const { email, source, userId } = req.body;
	
	if (!email || !source) {
		return res.json({ success: false, error: 'Empty/Missing fields' });
	}
	
	payments.createCustomer(email, source)
		.then(({ id }) => {
			if (id) 
				User.model.findOneAndUpdate({ _id: userId }, { $set: { '': id }}).exec((err) => {
					if (err) 
						res.json({ success: false, customer_id: null, error: 'Failed to create customer' });
					else
						res.json({ success: true, customer_id: id });
				});
			else 
				res.json({ success: false, customer_id: null, error: 'Failed to create customer' });
		})
		.catch(error => {
			res.json({ success: false, error });
		})
};

exports.getCustomer = function (req, res) {
	const { customer } = req.body;

	if (!customer) {
		return res.json({ success: false, error: 'Empty/Missing fields' });
	}
	
	payments.getCustomer(customer)
		.then(data => {
			if (data)
				res.json({ success: true, customer: data, error: null });
			else 
				res.json({ success: true, customer: null, error: 'No customer was returned' });
		})
		.catch(error => {
			res.json({ success: false, error });
		})
};

exports.makePayment = function (req, res) {
	const { stripeToken, amount, currency } = req.body;
	
	if (!stripeToken || !amount || !currency) {
		return res.json({ success: false, error: 'Empty/Missing fields' });
	}
	
	payments.makePayment(stripeToken, amount, currency)
		.then(charge => {
			res.json({ success: true, charge, error: null });
		})
		.catch(error => {
			res.json({ success: false, charge: null, error })
		})
};

exports.getPaymentCards = function (req, res) {
	const id = req.headers['x-cust-id'];
	
	if (!id) {
		return res.json({ success: false, error: 'Empty/Missing fields' });
	}
	
	payments.getPaymentCards(id)
		.then(cards => {
			res.json({ success: true, cards, error: null });
		}) 
		.catch(error => {
			res.json({ success: false, cards: null, error })
		})
};

exports.chargeCustomer = function (req, res) {
	const { customer, amount, currency } = req.body;
	
	if (!customer || !amount || !currency) {
		return res.json({ success: false, error: 'Empty/Missing fields' });
	}
	
	payments.chargeCustomer(customer, amount, currency)
		.then(charge => {
			res.json({ success: true, charge, error: null });
		})
		.catch(error => {
			res.json({ success: true, charge: null, error: error });
		})
};
