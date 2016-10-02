var Profile = require('../models/Profile')
var bcrypt = require('bcrypt')
var Promise = require('bluebird')

module.exports = {
	plural: 'profiles',

	find: function(params){
		return new Promise(function(resolve, reject){
			Profile.find(params, function(err, profiles){
				if (err){
					reject(err)
					return
				}

				var summaries = []
				for (var i=0; i<profiles.length; i++){
					var profile = profiles[i]
					summaries.push(profile.summary())
				}

				resolve(summaries)
			})
		})
	},

	get: function(params, isRaw, callback){
		Profile.find(params, function(err, profiles){
			if (err){
				if (callback != null)
					callback(err, null)

				return
			}

			if (callback != null){
				if (isRaw == true){
					callback(null, profiles)
					return
				}

				var summaries = []
				for (var i=0; i<profiles.length; i++){
					var profile = profiles[i]
					summaries.push(profile.summary())
				}

				callback(null, summaries)
			}
		})
	},

	getById: function(id, isRaw, callback){
		Profile.findById(id, function(err, profile){
			if (err){
				if (callback != null)
					callback({message:'Profile Not Found'}, null)

				return
			}

			if (callback != null)
				callback(null, profile.summary())
		})
	},

	post: function(params, callback){
		params['password'] = bcrypt.hashSync(params['password'], 10) // hash password
		if (params['firstName'] == null)
			params['firstName'] = params.email

		delete params.notify['quantity']

		var notify = params.notify
		notify['maxPrice'] = parseInt(notify.maxPrice)
		params['notify'] = notify

		Profile.create(params, function(err, profile){
			if (err){
				if (callback != null)
					callback(err, null)

				return
			}

			if (callback != null)
				callback(null, profile.summary())
		})
	},

	put: function(id, params, callback){
		var notify = params.notify
		notify['maxPrice'] = parseInt(notify.maxPrice)
		params['notify'] = notify

		Profile.findByIdAndUpdate(id, params, {new:true}, function(err, profile){
			if (err){
				if (callback != null)
					callback(err, null)

				return
			}

			if (callback != null)
				callback(null, profile.summary())
		})
	}


}