var mongoose = require('mongoose')

var ReplySchema = new mongoose.Schema({
	profile: {type:mongoose.Schema.Types.Mixed, default:{}},
	recipient: {type:mongoose.Schema.Types.Mixed, default:{}},
	message: {type:String, trim:true, lowercase:true, default:''},
	timestamp: {type:Date, default:Date.now}
})

ReplySchema.methods.summary = function(){
	var summary = {
		profile: this.profile,
		message: this.message,
		recipient: this.recipient,
		timestamp: this.timestamp,
		id: this._id
	}

	return summary
}

module.exports = mongoose.model('ReplySchema', ReplySchema)