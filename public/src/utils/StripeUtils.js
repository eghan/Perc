var cbk;
var stripeHandler;

export default {

	initialize: (callback) => {
//		cbk = completion
	    stripeHandler = StripeCheckout.configure({
	        key: 'pk_live_yKFwKJsJXwOxC0yZob29rIN5',
	        image: '/images/logo_round_blue_260.png',
	        billingAddress: true,
	        locale: 'auto',
	        panelLabel: 'Premium: $19.99/month',
	        token: (token) => { // You can access the token ID with `token.id`
	        	callback(token)
	        }
	    })

	    return stripeHandler

	},

	initializeWithText: (text, callback) => {
//		cbk = completion
	    stripeHandler = StripeCheckout.configure({
	        key: 'pk_live_yKFwKJsJXwOxC0yZob29rIN5',
	        image: '/images/logo_round_blue_260.png',
	        billingAddress: true,
	        locale: 'auto',
	        panelLabel: text,
	        token: (token) => { // You can access the token ID with `token.id`
	        	callback(token)
	        }
	    })
	    
	    return stripeHandler
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