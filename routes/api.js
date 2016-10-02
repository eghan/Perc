var express = require('express')
var router = express.Router()
var controllers = require('../controllers')

router.get('/:resource', function(req, res, next) {
	var resource = req.params.resource
	var controller = controllers[resource]
	if (controller == null){
	    res.json({
	    	confirmation: 'fail',
	    	message: 'Invalid Resource'
	    })

	    return
	}

	controller.get(req.query, false, function(err, results){
		if (err){
		    res.json({
		    	confirmation: 'fail',
		    	message: err
		    })

			return
		}

	    res.json({
	    	confirmation: 'success',
	    	results: results
	    })
	})
})

router.get('/:resource/:id', function(req, res, next) {
	var resource = req.params.resource
	var controller = controllers[resource]
	if (controller == null){
	    res.json({
	    	confirmation: 'fail',
	    	message: 'Invalid Resource'
	    })

	    return
	}

	controller.getById(req.params.id, false, function(err, result){
		if (err){
		    res.json({
		    	confirmation: 'fail',
		    	message: err.message
		    })

			return
		}

	    res.json({
	    	confirmation: 'success',
	    	result: result
	    })
	})
})

router.post('/:resource', function(req, res, next) {
	var resource = req.params.resource
	var controller = controllers[resource]
	if (controller == null){
	    res.json({
	    	confirmation: 'fail',
	    	message: 'Invalid Resource'
	    })

	    return
	}

	controller.post(req.body, function(err, result){
		if (err){
		    res.json({
		    	confirmation: 'fail',
		    	message: err
		    })

			return
		}

	    res.json({
	    	confirmation: 'success',
	    	result: result
	    })
	})
})

router.put('/:resource/:id', function(req, res, next) {
	var resource = req.params.resource
	var controller = controllers[resource]
	if (controller == null){
	    res.json({
	    	confirmation: 'fail',
	    	message: 'Invalid Resource'
	    })

	    return
	}

	controller.put(req.params.id, req.body, function(err, result){
		if (err){
		    res.json({
		    	confirmation: 'fail',
		    	message: err
		    })

			return
		}

	    res.json({
	    	confirmation: 'success',
	    	result: result
	    })
	})
})

module.exports = router