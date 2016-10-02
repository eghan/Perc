var Track = require('../models/Track')
var mongoose = require('mongoose')
var Promise = require('bluebird')
var resource = require('../utils/Resource')


module.exports = {
	plural: 'tracks',

	get: function(params, isRaw, completion){

		// fetch specific Course by ID:
		if (params.id != null){ 
			Track.findById(params.id, function(err, tracks){
				if (err){
					completion({message:'Track '+params.id+' not found'}, null);
					return
				}
				
				if (tracks == null){
					completion({message:'Track '+params.id+' not found'}, null);
					return
				}

				completion(null, tracks.summary())
			})
			return
		}
		
		
		/* Query by filters passed into parameter string: */
		var limit = params.limit;
		if (limit == null)
			limit = 0
		
		delete params['limit']
		
		Track.find(params, null, {limit:parseInt(limit), sort:{score: -1}}, function(err, tracks) {
			if (err) {
				completion({confirmation:'fail', message:err.message}, null)
				return
			}
			
			completion(null, resource.convertToJson(tracks))
		})
	},

	post: function(params, completion){
		Track.create(params, function(err, track){
			if (err){
				completion({confirmation:'fail', message:err.message}, null)
				return
			}
			
			completion(null, track.summary())
			return
		})
	},

	put: function(id, params, completion){
		Track.findByIdAndUpdate(id, params, {new:true}, function(err, track){
			if (err){
				completion({confirmation:'fail', message:err.message}, null)
				return
			}
			
			completion(null, track.summary())
			return
		});		
	},

	delete: function(){

	}


}



