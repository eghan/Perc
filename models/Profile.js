var mongoose = require('mongoose')

var ProfileSchema = new mongoose.Schema({
	firstName: {type:String, trim:true, lowercase:true, default:''},
	lastName: {type:String, trim:true, lowercase:true, default:''},
	phone: {type:String, trim:true, default:''},
	image: {type:String, trim:true, default:''},
	email: {type:String, trim:true, lowercase:true, default:''},
	credits: {type:Number, default:3}, // first 3 are free
	password: {type:String, trim:true, default:''},
	notify: {type:mongoose.Schema.Types.Mixed, default:{}}, // zips array, maxPrice number, bid value, notified array
	timestamp: {type:Date, default:Date.now}
})

ProfileSchema.methods.summary = function(){
	var summary = {
		firstName: this.firstName,
		lastName: this.lastName,
		phone: this.phone,
		image: this.image,
		email: this.email,
		credits: this.credits,
		notify: this.notify,
		timestamp: this.timestamp,
		id: this._id
	}

	return summary
}

module.exports = mongoose.model('ProfileSchema', ProfileSchema)