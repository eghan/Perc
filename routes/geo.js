var express = require('express')
var router = express.Router()
var superagent = require('superagent')


router.post('/:action', function(req, res, next){

	var action = req.params.action
	if (action == 'reversegeocode'){

		var url = 'https://maps.googleapis.com/maps/api/geocode/json'
		var params = {
			key: process.env.GOOGLE_MAPS_API_KEY,
			latlng: req.body.lat+','+req.body.lng
		}

		superagent
		.get(url)
		.query(params)
		.set('Accept', 'text/json')
		.end(function(err, response){
			if (err){
				res.json({
					confirmation:'fail',
					message: err
				})

				return
			}

	    	var results = response.body.results
	    	var locationInfo = results[0]
	    	var address_components = locationInfo['address_components'] // this is an array

	    	var data = {
	    		city:'',
	    		state: '',
	    		zip: '',
	    		neighborhood: ''
	    	}

	    	for (var i=0; i<address_components.length; i++){
	    		var component = address_components[i]
	    		var types = component.types // an array
	    		if (types == null)
	    			continue

	    		var value = component['long_name']
	    		if (value == null)
	    			continue

	    		if (types.indexOf('neighborhood') != -1)
	    			data['neighborhood'] = value.toLowerCase()
	    		
	    		if (types.indexOf('locality') != -1)
	    			data['city'] = value.toLowerCase()

	    		if (types.indexOf('administrative_area_level_1') != -1)
	    			data['state'] = component['short_name'].toLowerCase() // state, use abbreviation (NY vs New York)
	    		
	    		if (types.indexOf('postal_code') != -1)
	    			data['zip'] = value.toLowerCase()
	    	}

			res.json({
				confirmation: 'success',
				location: data
			})

		})
	}
})


module.exports = router