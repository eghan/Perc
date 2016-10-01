var express = require('express')
var router = express.Router()
var Profile = require('../models/Profile')
var ProfileController = require('../controllers/ProfileController')
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

		var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
		createNonregisteredStripeCharge(stripe, req.body.stripeToken, req.body.amount, 'Perc: '+req.body.description)
		.then(function(charge){
//			console.log('CHARGE: '+JSON.stringify(charge))
			// {"id":"ch_18zf6oC5b8QCRB75OIl7flYq","object":"charge","amount":500,"amount_refunded":0,
			// "application_fee":null,"balance_transaction":"txn_18zf6pC5b8QCRB75wiIc511E","captured":true,
			// "created":1475296102,"currency":"usd","customer":null,"description":"Perc: notifications",
			// "destination":null,"dispute":null,"failure_code":null,"failure_message":null,"fraud_details":{},
			// "invoice":null,"livemode":true,"metadata":{},"order":null,"paid":true,"receipt_email":null,
			// "receipt_number":null,"refunded":false,"refunds":{"object":"list","data":[],"has_more":false,
			// "total_count":0,"url":"/v1/charges/ch_18zf6oC5b8QCRB75OIl7flYq/refunds"},"shipping":null,
			// "source":{"id":"card_18zf6jC5b8QCRB75Rb5ATOMI","object":"card","address_city":"Woodcliff Lake",
			// "address_country":"United States","address_line1":"12 Lyons Court","address_line1_check":"pass",
			// "address_line2":null,"address_state":"NJ","address_zip":"07677","address_zip_check":"pass",
			// "brand":"Visa","country":"US","customer":null,"cvc_check":"pass","dynamic_last4":null,
			// "exp_month":6,"exp_year":2020,"fingerprint":"hltRklDPg2R0e0Tx","funding":"debit","last4":"9072",
			// "metadata":{},"name":"denny kwon","tokenization_method":null},"source_transfer":null,
			// "statement_descriptor":null,"status":"succeeded"}

			return ProfileController.find({email: customerEmail})			
		})
		.then(function(profiles){
			var text = customerEmail+' purchased '+req.body.description
			EmailUtils.sendEmails('info@thegridmedia.com', ['dkwon@velocity360.io'], type.toUpperCase()+' Purchase', text)

			if (profiles.length == 0){ // unregistered user, create profile
				Profile.create(req.body, function(err, profile){
					if (err){
						res.json({
							confirmation: 'fail',
							message: err
						})

						return
					}

					req.session.user = profile.id // login as user
					res.json({
						confirmation:'success',
						profile:profile.summary()
					})
				})

				return
			}

			var profile = profiles[0] // registered user
			req.session.user = profile.id // login as user

			var response = {
				confirmation:'success',
				profile:profile.summary()
			}

			res.json(response)
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
