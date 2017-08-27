/**
 * Created by jesseonolememen on 25/08/2017.
 */
var async = require('async'),
	keystone = require('keystone');

let Orders = keystone.list('Order');

exports.getOrdersForUser = function (req, res) {
	Orders.model.find().where('user').in([req.params.id]).populate('transaction').populate('products').populate('user', '-password').exec(function (err, items) {
		if (err) return res.json({
			error: err,
			success: false,
		});

		res.json({
			success: true,
			results: items
		});
	});
}
