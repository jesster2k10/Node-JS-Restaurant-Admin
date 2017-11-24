/**
 * Created by jesseonolememen on 24/11/2017.
 */
var pushNotifcations = require('node-pushnotifications');

const settings = {
	gcm: {
		id: null
	},
	apn: {
		token: {
			
		}
	}
};

const push = new pushNotifcations(settings);

exports.PushNotifications = push;

exports.sendNotification = (title, message, id) => new Promise(async (resolve, reject) => {
	try {
		let result = await push.send(id, {
			title: title,
			body: message,
			priority: 'high',
		});
		
		resolve(result);
	} catch (error) {
		reject(error);
	}
});
