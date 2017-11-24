/**
 * Created by jesseonolememen on 23/11/2017.
 */
const NodeGeocoder = require('node-geocoder');
const geolib = require('geolib');

var geocoder = NodeGeocoder({
	apiKey: 'AIzaSyDzI5cA4F3OCk2PUf2QN788gpK3OaP8FVU'
});

const formatAddress = ({ street1, suburb, state, postcode, country }) => `${street1}, ${suburb}, ${state}, ${postcode}, ${country}`;

const geoCodeAddress = (address) => new Promise(async (resolve, reject) => {
	try {
		let result = await geocoder.geocode(address);
		resolve(result);
	} catch (error) {
		reject(error)
	}
})

exports.calcDistanceBetween = (ad1, ad2) => new Promise(async (resolve, reject) => {
	try {
		let geocodedAd1 = await geoCodeAddress(ad1);
		let geocodedAd2 = await geoCodeAddress(ad2);
		
		let dist1 = { 
			latitude: geocodedAd1[0].latitude,
			longitude: geocodedAd1[0].longitude,
		};

		let dist2 = {
			latitude: geocodedAd2[0].latitude,
			longitude: geocodedAd2[0].longitude,
		};
		
		let distance = geolib.getDistance(dist1, dist2) / 1000;
		
		resolve(distance);
	} catch (error) {
		reject(error);
	}
});

exports.geoCodeAddress = geoCodeAddress;
exports.formatAddress = formatAddress;
