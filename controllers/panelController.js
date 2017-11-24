/**
 * Created by jesseonolememen on 23/11/2017.
 */
var keystone = require('keystone');
var Order = keystone.list('Order').model;

exports.getCurrency = () => new Promise((resolve, reject) => {
	resolve('€')	
});

exports.getTotalOrders = () => new Promise((resolve, reject) => {
	Order.count.exec((error, result) => {
		if (error) {
			reject(error);
		} else {
			resolve(result);
		}
	});
});

exports.getTotalSales = () => new Promise(async (resolve, reject) => {
	keystone.list('Order').model.aggregate([
		{
			$match: {
				status: 'Completed'
			}
		},
		{
			$group: {
				_id: null,
				total: { $sum: "$total" },
				delivery: { $sum: "$delivery" }
			}
		}
	]).exec(function (error, result) {
		if (!error && result && result.length > 0) {
			let total = Number(result[0].total) + Number(result[0].delivery);
			resolve(total);
		}

		if (result.length < 1) {
			reject(null);
		}

		if (!result && !error) {
			reject(null);
		}

		if (error) {
			reject(error);
		}
	})
});
