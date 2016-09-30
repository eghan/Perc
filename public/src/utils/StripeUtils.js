var cbk;
var stripeHandler;

export default {

	initialize: (completion) => {
//		cbk = completion
	    stripeHandler = StripeCheckout.configure({
	        key: process.env.STRIPE_PK_LIVE,
	        image: '/images/logo_round_blue_260.png',
	        address: true,
	        locale: 'auto',
	        panelLabel: 'Premium: $19.99/month',
	        token: (token) => { // You can access the token ID with `token.id`
	        	completion(token)
	        }
	    })
	},

	initializeWithText: (text, completion) => {
//		cbk = completion
	    stripeHandler = StripeCheckout.configure({
	        key: process.env.STRIPE_PK_LIVE,
	        image: '/images/logo_round_blue_260.png',
	        address: true,
	        locale: 'auto',
	        panelLabel: text,
	        token: (token) => { // You can access the token ID with `token.id`
	        	completion(token)
	        }
	    })
	},

	showModal: () => {
		if (stripeHandler == null)
			return

	    stripeHandler.open({
		    name: 'Perc',
		    description: 'Premium Subscription'
	    })
	},

	showModalWithText: (text) => {
		if (stripeHandler == null)
			return

	    stripeHandler.open({
		    name: 'Perc',
		    description: text
	    })
	}


}