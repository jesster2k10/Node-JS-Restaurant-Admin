/**
 * Created by jesseonolememen on 03/11/2017.
 */
const Keystone = require('keystone');
const RestaurantInformation = Keystone.list('RestaurantInformation').model;

exports.update = (req, res) => {
	if (!req.body) {
		return res.status(401).json({ error: 'You must include at least one valid change', success: false });
	}

	const {
		name,
		about,
		instagram,
		twitter,
		facebook,
		website,
		google,
		youtube
	} = req.body;
	
	RestaurantInformation.findOneAndUpdate({ key: 2 }, { $set: req.body }, (error, doc) => {
		if (error) {
			return res.status(400).json({ error: error.message, success: false });
		}

		if (!doc) {
			return res.status(401).json({ error: 'Not found', success: false });
		}
		
		return res.status(200).json({ success: true });
	})
};
