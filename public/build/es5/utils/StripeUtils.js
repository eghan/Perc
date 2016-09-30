"use strict";

var cbk;
var stripeHandler;

module.exports = {

	initialize: function (completion) {
		//		cbk = completion
		stripeHandler = StripeCheckout.configure({
			key: process.env.STRIPE_PK_LIVE,
			image: "/images/logo_round_blue_260.png",
			address: true,
			locale: "auto",
			panelLabel: "Premium: $19.99/month",
			token: function (token) {
				// You can access the token ID with `token.id`
				completion(token);
			}
		});
	},

	initializeWithText: function (text, completion) {
		//		cbk = completion
		stripeHandler = StripeCheckout.configure({
			key: process.env.STRIPE_PK_LIVE,
			image: "/images/logo_round_blue_260.png",
			address: true,
			locale: "auto",
			panelLabel: text,
			token: function (token) {
				// You can access the token ID with `token.id`
				completion(token);
			}
		});
	},

	showModal: function () {
		if (stripeHandler == null) return;

		stripeHandler.open({
			name: "Perc",
			description: "Premium Subscription"
		});
	},

	showModalWithText: function (text) {
		if (stripeHandler == null) return;

		stripeHandler.open({
			name: "Perc",
			description: text
		});
	}


};