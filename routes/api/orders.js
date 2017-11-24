/**
 * Created by jesseonolememen on 24/11/2017.
 */ 

var helper = require('../../helpers/orders');

exports = module.exports = function (req, res) {
	let { order } = req.body;
	
	helper.calculateTimeToDeliverOrder(order)
		.then(wait => res.status(200).send({
			wait,
		}))
		.catch(error => res.status(500).send({
			error,
		}));
};
