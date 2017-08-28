/**
 * Created by jesseonolememen on 28/08/2017.
 */
let keystone = require('keystone'),
	Types = keystone.Field.Types;

let Photo = new keystone.List('Photo', {
	map: { name: 'caption' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Photo.add({
	image: { type: Types.CloudinaryImage, required: true, initial: true },
	caption: { type: String, required: false },
	date: { type: Types.Datetime, default: Date.now, required: false },
	linkedMeals: { type: Types.Relationship, ref: 'Meal', many: true, required: false }
});

Photo.register();
