/**
 * Created by jesseonolememen on 28/08/2017.
 */
let keystone = require('keystone'),
	Types = keystone.Field.Types;

let RestaurantInformation = new keystone.List('RestaurantInformation', {
	autokey: { path: 'slug', from: 'title', unique: true },
	hidden: true,
});

RestaurantInformation.add({
	key: { type: String, required: false  },
	name: { type: String, required: false },
	about: { type: Types.Textarea, required: false },
	logo: { type: Types.CloudinaryImage, required: false },
	website: { type: Types.Url, required: false },
}, 'Social', {
	facebookURL: { type: Types.Url, required: false },
	twitterURL: { type: Types.Url, required: false },
	googleURL: { type: Types.Url, required: false },
	youtubeURL: { type: Types.Url, required: false },
});

RestaurantInformation.register();
