var express = require('express')
var router = express.Router()
var Profile = require('../models/Profile')
var EmailUtils = require('../utils/EmailUtils')
var Promise = require('bluebird')


function createStripeAccount(stripe, profile, stripeToken, amount){ // amount can be null
    return new Promise(function (resolve, reject){

		stripe.customers.create({
			description: profile.id,
			source: stripeToken
		}, function(err, customer) {
			if (err){
	            reject(err);
	            return; 
			}
			
			var card = customer.sources.data[0]
			profile['creditCard'] = {
				'id':customer.id,
				'lastFour':card.last4,
				'exp_month':card.exp_month,
				'exp_year':card.exp_year,
				'brand':card.brand
			}

			profile['stripeId'] = customer.id
			profile.save()

			if (amount == null){
			    resolve(profile)
				return
			}

	        // resolve(customer);
	        var cents = amount * 100
			stripe.charges.create({
					amount: cents, // amount in cents, need to multiply by 100
					currency: 'usd',
					customer: customer.id,
					description: 'Example charge',
				}, function(error, charge) {
					if (error){ // check for `err`
			            reject(err)
			            return
					}

			        resolve(charge)
//					res.send({'confirmation':'success', 'charge':charge});
					return
			})
		})
    })
}

function createStripeCharge(stripe, amount, customerId, description){
    return new Promise(function (resolve, reject){
		stripe.charges.create({
				amount: amount*100, // amount in cents
				currency: 'usd',
				customer: customerId,
				description: description,
			}, function(err, charge) {
				if (err){ // check for `err`
		            reject(err)
		            return
				}

		    	resolve(charge)
		})
    })
}

function createNonregisteredStripeCharge(stripe, stripeToken, amount, description){
    return new Promise(function (resolve, reject){
		stripe.charges.create({
				amount: amount*100, // amount in cents
				currency: 'usd',
				source: stripeToken,
				description: description,
			}, function(err, charge) {
				if (err){ // check for `err`
		            reject(err)
		            return
				}

		    	resolve(charge)
		})
    })
}


router.post('/:action', function(req, res, next) {
	var action = req.params.action

	if (action == 'charge') {
		var customerEmail = req.body.email
		var type = req.body.type
		console.log('TEST 3')

		var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
		console.log('TEST 4')
		createNonregisteredStripeCharge(stripe, req.body.stripeToken, req.body.amount, 'Perc: '+req.body.description)
		.then(function(charge){
			console.log('CHARGE: '+JSON.stringify(charge))

			// var productId = req.body.product
			// customerName = charge.source.name // this comes from Stripe
			// if (type == 'project')
			// 	return findProject(productId)
			
			// if (type == 'course')
			// 	return findCourse(productId)

			// if (type == 'tutorial')
			// 	return findTutorial(productId)

			return findProfile({email: customerEmail})			
		})
		// .then(function(product){
		// 	prod = product

		// 	var params = null
		// 	if (req.session == null)
		// 		params = {email: customerEmail}
		// 	else if (req.session.user == null)
		// 		params = {email: customerEmail}
		// 	else 
		// 		params = {id: req.session.user} // logged in user

		// 	return findProfile(params)
		// })
		.then(function(profiles){
			var text = customerEmail+' purchased '+prod.title
			EmailUtils.sendEmails('info@thegridmedia.com', ['dkwon@velocity360.io'], type.toUpperCase()+' Purchase', text)

			if (profiles.length == 0){ // unregistered user
				res.json({
					confirmation:'success'
				})

				return
			}

			// registered user
			var profile = profiles[0]
			req.session.user = profile.id // login as user
			var subscribers = prod.subscribers

			var response = {
				confirmation:'success',
				profile:profile.summary()
			}

			response[req.body.type] = prod.summary()
			res.jsonsend(response)
		})
		.catch(function(err){
			console.log('CHARGE ERROR: '+err.message)
			res.json({confirmation:'fail', message:err.message})
			return
		})
		
		return
	}


	// Apply a credit card to a profile:
	if (action == 'card') {
		var stripeToken = req.body.stripeToken
		if (stripeToken == null){
			res.json({confirmation:'fail', message:'Missing stripeToken parameter'})
			return
		}
		
		if (req.session == null){
			res.send({confirmation:'fail', message:'User not logged in.'})
			return
		}

		if (req.session.user  == null){
			res.send({confirmation:'fail', message:'User not logged in.'})
			return
		}
		
		var userId = req.session.user
		findProfile({id: userId}) // this still returns an array
		.then(function(profiles){
			var profile = profiles[0]
			
			var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
			stripe.customers.create({
				description: profile.id,
				source: stripeToken
			}, function(err, customer) {
				if (err){
					res.json({confirmation:'fail', 'message':err.message})
					return;
				}
				
				profile['accountType'] = 'premium'
				profile['monthlyRate'] = 19.99
				var promoCode = req.body.promoCode

				if (promoCode != null){ // check promo code
					profile['promoCode'] = promoCode
					if (promoCode == 'nyu'){
						profile['monthlyRate'] = 9.99
					}
				}

				res.json({confirmation:'success', profile:profile.summary()})
				
				var card = customer.sources.data[0]
				profile['stripeId'] = customer.id
				profile['creditCard'] = {id:customer.id, lastFour:card.last4, exp_month:card.exp_month, exp_year:card.exp_year, brand:card.brand}

				EmailUtils.sendEmail('info@thegridmedia.com', 'dkwon@velocity360.io', 'New Premium Subscriber', JSON.stringify(profile.summary()))
				profile.save()
				return
			})
		})
		.catch(function(err){
			res.send({confirmation:'fail', message:err.message})
		})

		return
	}
	
})


module.exports = router
