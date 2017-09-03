/**
 * Created by jesseonolememen on 15/07/2017.
 */
var async = require('async'),
	keystone = require('keystone');

var Cart = keystone.list('Cart');
var MealCategory = keystone.list('MealCategory');

exports.getCart = function (req, res) {
	Cart.model.findOne({ _id: req.params.id }).populate({
		path: "products",
		populate: { path: "options"}
	}).populate({
		path: "products",
		populate: { path: 'categories' }
	}).exec(function (err, items) {
		if (err) {
			res.json({
				success: false,
				error: err
			});
		} else {
			res.json({
				success: true,
				results: items
			})

		}
	})
};

exports.clearCart = function (req, res) {
	Cart.model.findOne({ _id: req.params.id }).populate({
		path: "products",
		populate: { path: "options"}
	}).populate({
		path: "products",
		populate: { path: 'categories' }
	}).exec(function (err, cart) {
		if (err) {
			res.json({
				success: false,
				error: err.message
			});
		} else {
			if (cart) {
				cart.products = [];
				cart.options = [];
				cart.save(function (err) {
					if (err) {
						res.json({
							success: false,
							error: err.message
						});
					} else {
						res.json({
							success: true,
							error: null
						});
					}
				})
			} else {
				res.json({
					success: false,
					error: 'No cart was found.'
				});
			}

		}
	})	
};

exports.addProductToCart = function (req, res) {
	if (req.body.product !== undefined) {
		
		if (req.body.option !== undefined) {
			Cart.model.findByIdAndUpdate(req.params.id, { $push: { products: req.body.product, options: req.body.option } }, { safe: true, upsert: true }).exec(function (err, items) {
				if (err) return res.json({error: err });

				res.json({
					results: {
						products: items
					}
				});
			})
		} else {
			Cart.model.findByIdAndUpdate(req.params.id, { $push: { products: req.body.product } }, { safe: true, upsert: true }).exec(function (err, items) {
				if (err) return res.json({error: err });

				res.json({
					results: {
						products: items
					}
				});
			})
		}
	} else {
		res.json({
			error: {
				message: 'No product identifier was found'
			}
		})
	}
};

exports.removeProductFromCart = function (req, res) {
	let data = JSON.parse(req.body);
	console.log('\nn\n\n\n\n\n\n\n');
	console.log(data)
	if (data.product) {
		Cart.model.update({ _id: req.params.id }, { $pullAll: {products: [req.body.product] } }).exec(function (err, items) {
			if (err) return res.json({error: err });

			res.json({
				results: {
					products: items
				}
			});
		})
	} else {
		res.json({
			error: {
				message: 'No product identifier was found'
			}
		})
	}
};

