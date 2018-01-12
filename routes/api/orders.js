/**
 * Created by jesseonolememen on 24/11/2017.
 */ 

var keystone = require('keystone');
var moment = require('moment');
var helper = require('../../helpers/orders');

// exports = module.exports = function (req, res) {
// 	let { order } = req.body;
//	
// 	helper.calculateTimeToDeliverOrder(order)
// 		.then(wait => res.status(200).send({
// 			wait,
// 		}))
// 		.catch(error => res.status(500).send({
// 			error,
// 		}));
// };

exports.fullfillOrder = async (req, res) => {
	const { id } = req.params;
	
	try {
		let order = await keystone.list('Order').model.findOne({ _id: id }).exec();
		let strWait = moment(new Date).add(order.waitTime, 'm').format('HH:mm');
		let waitTime = req.body.waitTime ? req.body.waitTime : order.waitTime ?
			{
				wait: order.waitTime,
				str: strWait,
			} : null;
				
		if (!waitTime) {
			return res.status(400).json({
				success: false,
				results: {
					error: {},
					message: 'You must add a wait time',
				}
			})
		}		
		
		order.status = 'Completed';
		order.paymentType = order.paymentType.toUpperCase();
		
		let newOrder = await order.save();
		
		return res.status(200).json({
			success: true,
			results: {
				waitTime,
				order: newOrder,
			}
		});
	} catch (error) {
		return res.status(400).json({
			success: false,
			error: error,
			message: error.message
		})
	}
};
