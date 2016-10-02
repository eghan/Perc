var mongoose = require('mongoose')

var TrackSchema = new mongoose.Schema({
	pageMap: {type:mongoose.Schema.Types.Mixed, default:{}},
	timestamp: {type:Date, default:Date.now}
})

TrackSchema.methods.summary = function(){
	var summary = {
		pageMap: this.pageMap,
		timestamp: this.timestamp,
		id: this._id
	}

	return summary
}

module.exports = mongoose.model('TrackSchema', TrackSchema)