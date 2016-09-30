"use strict";

var cbk;
var stripeHandler;

module.exports = {

	initialize: function (callback) {
		//		cbk = completion
		stripeHandler = StripeCheckout.configure({
			key: "pk_live_yKFwKJsJXwOxC0yZob29rIN5",
			image: "/images/logo_round_blue_260.png",
			billingAddress: true,
			locale: "auto",
			panelLabel: "Premium: $19.99/month",
			token: function (token) {
				// You can access the token ID with `token.id`
				callback(token);
			}
		});

		return stripeHandler;
	},

	initializeWithText: function (text, callback) {
		//		cbk = completion
		stripeHandler = StripeCheckout.configure({
			key: "pk_live_yKFwKJsJXwOxC0yZob29rIN5",
			image: "/images/logo_round_blue_260.png",
			billingAddress: true,
			locale: "auto",
			panelLabel: text,
			token: function (token) {
				// You can access the token ID with `token.id`
				callback(token);
			}
		});

		return stripeHandler;
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