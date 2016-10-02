var express = require('express')
var router = express.Router()
var controllers = require('../controllers')


router.get('/:action', function(req, res, next) {
	var action = req.params.action

	if (action == 'currentuser') {
		console.log('TEST 1')
		var accountController = controllers.account
		console.log('TEST 2')
		accountController.checkCurrentUser(req, function(err, results){
			if (err){
				res.json({confirmation:'fail', message:err.message})
				return
			}

			res.json({
				confirmation: 'success',
				user: results
			})
		})
		return
	}

	if (action == 'logout') {
		req.session.reset()
		res.redirect('/')
		return
	}

	res.json({
		confirmation:'fail',
		message: 'Invalid Action'
	})
})

router.post('/:action', function(req, res, next) {
	var action = req.params.action

	if (action == 'login') {
		var accountController = controllers.account
		accountController.login(req.body, function(err, profile){
			if (err){
				res.json({confirmation:'fail', message:err.message})
				return
			}

			req.session.user = profile.id // install cookie with profile id set to 'user'
			res.json({
				confirmation: 'success',
				user: profile
			})
		})
		return
	}

	if (action == 'register') {
		var profileController = controllers.profile
		profileController.post(req.body, function(err, profile){
			if (err){
				res.json({confirmation:'fail', message:err.message})
				return
			}

			req.session.user = profile.id // install cookie with profile id set to 'user'
			res.json({
				confirmation: 'success',
				user: profile
			})
		})
		return
	}

	res.json({
		confirmation:'fail',
		message: 'Invalid Action'
	})

})


module.exports = router
