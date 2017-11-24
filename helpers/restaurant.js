/**
 * Created by jesseonolememen on 21/08/2017.
 */
var keystone = require('keystone');

exports.getStoreAddress = () => "1 Newcastle Woods Square, Enfield, Co. Meath, Ireland";

exports.getBaseTime = () => 10;

exports.getAvaliableStaff = () => new Promise((resolve, reject) => {
	keystone.list('User').model.aggregate([
		{
			$match: {
				status: 'Pending'
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
			resolve(result);
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

exports.getPendingOrders = () => new Promise((resolve, reject) => {
	keystone.list('Order').model.aggregate([
		{
			$match: {
				status: 'Pending'
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
			resolve(result);
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

exports.calculateTotalSales = function () {
	return new Promise((resolve, reject) => {
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
};
