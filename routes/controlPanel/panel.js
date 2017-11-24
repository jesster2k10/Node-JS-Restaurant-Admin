/**
 * Created by jesseonolememen on 21/08/2017.
 */
var keystone = require('keystone');
var controller = require('../../controllers/panelController');

exports = module.exports = async function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	
	try {
		let totalOrders = await controller.getTotalOrders();
		let totalSales = await controller.getTotalSales();
		let currency = await controller.getCurrency();
		
		view.render('dashboard', {
			totalSales,
			currency,
			totalOrders,
		})
	} catch (_) {
		view.render('dashboard', {
			totalSales: 0,
			currency: '€',
			totalOrders: 0,
		})
	}

};
