var mongoose = require('mongoose')

var PostSchema = new mongoose.Schema({
	title: {type:String, trim:true, default:''},
	status: {type:String, trim:true, default:''},
	contact: {type:String, trim:true, default:''}, // email address
	slug: {type:String, trim:true, default:''},
	address: {type:String, trim:true, default:''},
	city: {type:String, trim:true, default:''},
	state: {type:String, trim:true, default:''},
	zip: {type:String, trim:true, default:''},
	zone: {type:String, trim:true, default:''}, // midtown east or 10016
	image: {type:String, trim:true, default:''},
	images: {type:Array, default:[]},
	notified: {type:Array, default:[]},
	type: {type:String, trim:true, default:'job'}, // job, for sale, rental, etc
	description: {type:String, trim:true, default:''},
	price: {type:Number, default:0},
	profile: {type:mongoose.Schema.Types.Mixed, default:{}},
	geo: {
		type: [Number], // array of Numbers
		index: '2d'
	},
	timestamp: {type:Date, default:Date.now}
})

PostSchema.methods.summary = function(){
	var summary = {
		title: this.title,
		status: this.status,
		contact: this.contact,
		slug: this.slug,
		address: this.address,
		city: this.city,
		state: this.state,
		zip: this.zip,
		zone: this.zip,
		image: this.image,
		images: this.images,
		notified: this.notified,
		type: this.type,
		description: this.description,
		price: this.price,
		profile: this.profile,
		geo: this.geo,
		timestamp: this.timestamp,
		id: this._id
	}

	return summary
}

module.exports = mongoose.model('PostSchema', PostSchema)