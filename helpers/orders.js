/**
 * Created by jesseonolememen on 23/11/2017.
 */
var restaurant = require('../helpers/restaurant');
var locations = require('../helpers/locations');

exports.calculateTimeToDeliverOrder = (order) => new Promise (async (resolve, reject) => {
	try {
		let totalPendingOrders = await restaurant.getPendingOrders().length;
		let totalAvaliableStaff = await restaurant.getAvaliableStaff().length;
		let storeAddress = restaurant.getStoreAddress();
		let baseTime = restaurant.getBaseTime();
		let productsCount = order.products.length;
		
		if (totalPendingOrders == 0 || !totalPendingOrders) {
			totalPendingOrders = 1;
		}
		
		if (totalAvaliableStaff === 0 || !totalAvaliableStaff) {
			totalAvaliableStaff = 1;
		}
		
		if (productsCount === 0 || !productsCount) {
			productsCount = 1;
		}
		
		if (order.type == 'Delivery' || order.type == 'DELIVERY') {
			let distance = await locations.calcDistanceBetween(locations.formatAddress(order.deliveryAddress), storeAddress);
			
			const deliveryWait = ( (totalPendingOrders * 10) ) / ( 10 * (1.5 * totalAvaliableStaff)) + (distance / 1.25) + baseTime + ((baseTime/3) * productsCount);
			
			resolve(Math.round(deliveryWait));
			
			return;
		}
		
		const collectionWait = (totalPendingOrders * 10) / (10 * (1.5 * totalAvaliableStaff)) + baseTime + ((baseTime/3) * productsCount);
		resolve(Math.round(collectionWait));
	} catch (error) {
		reject(error);
	}
});
