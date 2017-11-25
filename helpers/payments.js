/**
 * Created by jesseonolememen on 13/10/2017.
 */
let stripe = require("stripe")("sk_test_uJvst0Dfrs2X4KOJSkbvXqjq");
let braintree = require("braintree");

const gateway = braintree.connect({
	environment: braintree.Environment.Sandbox,
	merchantId: process.env.BRAINTREE_MERCHANT_ID,
	publicKey: process.env.BRAINTREE_PUBLIC_KEY,
	privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

exports.Braintree = {
	getDefaultGateway: function () {
		return gateway;
	},
	
	getClientToken: function () {
		return new Promise((resolve, reject) => {
			gateway.clientToken.generate({}, (error, response) => {
				if (error) {
					reject(error);
				} else {
					resolve(response.clientToken);
				}
			})
		})
	},
	
	makePayment: function (nonce, amount) {
		return new Promise((resolve, reject) => {
			gateway.transaction.sale({
				amount: `${amount}`,
				paymentMethodNonce: nonce,
				options: {
					submitForSettlement: true
				}
			}, function(error, result) {
				console.log(result);
				
				if (!result.errors) {
					resolve(result);
				} else if (result.message && result.errors) {
					reject(result.message);
				} else {
					reject(error);
				}
			});
		})
	}
};

exports.createCustomer = (email, source) => {
	return new Promise((resolve, reject) => {
		stripe.customers.create({
			email, 
			source
		}, (err, customer) => {
			if (err)
				reject(err.message);
			
			if (customer) 
				resolve(customer);
		})		
	});
};

exports.getCustomer = (customer) => {
	return new Promise((resolve, reject) => {
		stripe.customers.retrieve(customer, (err, charge) => {
			if (err)
				reject(err.message);
			
			if (charge)
				resolve(charge);

		});
	})
};

exports.makePayment = (token, amount, currency) => {
	return new Promise((resolve, reject) => {
		stripe.charges.create({
			amount,
			source: token,
			currency: `${currency}`.toLowerCase()
		}, (err, charge) => {
			if (err)
				reject(err.message);

			if (charge)
				resolve(charge);
		})		
	});
};

exports.getPaymentCards = (customer) => {
	return new Promise((resolve, reject) => {
		stripe.customers.listCards(customer, (err, cards) => {
			if (err)
				reject(err.message);

			if (cards)
				resolve(cards);
		});
	});
};

exports.chargeCustomer = (customer, amount, currency) => {
	return new Promise((resolve, reject) => {
		stripe.charges.create({
			amount,
			customer,
			currency
		}, (err, cards) => {
			if (err)
				reject(err.message);

			if (cards)
				resolve(cards);
		})
	})
}
