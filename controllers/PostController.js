var Post = require('../models/Post')
var resource = require('../utils/Resource')
var Request = require('../utils/Request')
var TextUtils = require('../utils/TextUtils')
var Promise = require('bluebird')

module.exports = {
	plural: 'posts',

	find: function(params, isRaw){
		return new Promise(function(resolve, reject){
			var limit = params.limit
			if (limit == null)
				limit = 0
			
			delete params['limit']

			Post.find(params, null, {limit:limit, sort:{timestamp: -1}}, function(err, posts){
				if (err){
					reject(err)
					return
				}

				resolve(resource.convertToJson(posts))
			})
		})
	},

	get: function(params, isRaw, completion){

//		this is a geospatial query
		if (params.lat!=null && params.lng!=null){
			var distance = 1000/6371 // 6371 is radius of earth in KM
			params['geo'] = {
			  	$near: [params.lat, params.lng],
		  		$maxDistance: distance
			}

			delete params['lat']
			delete params['lng']
		}

		/* Query by filters passed into parameter string: */
		var limit = params.limit
		if (limit == null)
			limit = 0
		
		delete params['limit']
		
		Post.find(params, null, {limit:limit, sort:{timestamp: -1}}, function(err, posts) {
			if (err) {
				completion(err, null)
				return
			}
			
			completion(null, resource.convertToJson(posts))
		})
	},

	getById: function(id, isRaw, callback){
		Post.findById(id, function(err, post){
			if (err){
				if (callback != null)
					callback({message:'Post Not Found'}, null)

				return
			}

			if (callback != null)
				callback(null, post.summary())
		})
	},

	post: function(params, completion){
		params['slug'] = TextUtils.slugVersion(params.title)

		// https://maps.googleapis.com/maps/api/geocode/json?address=172+lexington+avenue,new+york,ny&key=AIzaSyA7ubOEswjvE09Hdpii4ZRi__SndjdE7ds
	    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+params.address+','+params.city+','+params.state

	    Request.get(url, {key:process.env.GOOGLE_MAPS_API_KEY})
	    .then(function(response){
	    	console.log(JSON.stringify(response))

	    	var results = response.results
	    	var locationInfo = results[0]
	    	var geometry = locationInfo.geometry
	    	var location = geometry.location
	    	var geo = [location.lat, location.lng]
	    	params['geo'] = geo

	    	var address_components = locationInfo['address_components'] // this is an array
	    	if (address_components != null){ // find zip code...

	    		var zip = ''
	    		var zone = '' // midtown, upper east side, etc
		    	for (var i=0; i<address_components.length; i++){
		    		var component = address_components[i]
		    		var types = component['types'] // this is an array
		    		if (types == null)
		    			continue

		    		var value = component['long_name']
		    		if (value == null)
		    			continue

		    		if (types.indexOf('postal_code') != -1)
				    	zip = value.toLowerCase()
		    		
		    		if (types.indexOf('neighborhood') != -1)
				    	zone = value.toLowerCase()
		    	}

			    params['zip'] = zip
			    params['zone'] = zone
	    	}

			Post.create(params, function(error, post){
				if (error){
					completion({confirmation:'fail', message:error.message}, null)
					return
				}
				
				completion(null, post.summary())
				return
			})
	    })
	    .catch(function(err){
	    	console.log('ERROR: '+err)

	    })
	},

	put: function(id, params, completion){
		Post.findByIdAndUpdate(id, params, {new:true}, function(err, post){
			if (err){
				completion({confirmation:'fail', message:err.message}, null)
				return
			}
			
			completion(null, post.summary())
			return
		})
	},

	delete: function(){

	}

}

