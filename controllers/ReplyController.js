var Reply = require('../models/Reply')
var resource = require('../utils/Resource')
var Request = require('../utils/Request')
var TextUtils = require('../utils/TextUtils')
var EmailUtils = require('../utils/EmailUtils')
var Promise = require('bluebird')

module.exports = {
	plural: 'replies',

	find: function(params, isRaw){
		return new Promise(function(resolve, reject){
			var limit = params.limit
			if (limit == null)
				limit = '0'
			
			delete params['limit']

			Reply.find(params, null, {limit:limit, sort:{timestamp: -1}}, function(err, replies){
				if (err){
					reject(err)
					return
				}

				resolve(resource.convertToJson(replies))
			})
		})
	},

	get: function(params, isRaw, completion){
		/* Query by filters passed into parameter string: */
		var limit = params.limit
		if (limit == null)
			limit = '0'
		
		delete params['limit']
		
		Reply.find(params, null, {limit:limit, sort:{timestamp: -1}}, function(err, replies) {
			if (err) {
				completion({confirmation:'fail', message:err.message}, null)
				return
			}
			
			completion(null, resource.convertToJson(replies))
		})
	},

	getById: function(id, isRaw, completion){
		Reply.findById(id, function(err, reply){
			if (err){
				if (completion != null)
					completion({message:'Reply Not Found'}, null)

				return
			}

			if (completion != null)
				completion(null, reply.summary())
		})
	},

	post: function(params, completion){
		Reply.create(params, function(err, reply){
			if (err){
				if (completion != null)
					completion(err, null)

				return
			}

			EmailUtils.sendEmail(process.env.ADMIN_EMAIL, reply.recipient.email, reply.subject, reply.message)
			.then(function(){
				if (completion != null)
					completion(null, reply.summary())
			})
			.catch(function(error){
				if (completion != null)
					completion(error, null)
			})
		})		
	},

	put: function(id, params, completion){
		Reply.findByIdAndUpdate(id, params, {new:true}, function(err, reply){
			if (err){
				completion({confirmation:'fail', message:err.message}, null)
				return
			}
			
			completion(null, reply.summary())
			return
		})
	},

	delete: function(){

	}

}

