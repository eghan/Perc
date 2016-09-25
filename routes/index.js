var express = require('express')
var router = express.Router()

//require('node-jsx').install({ extension: ".js" })
var React = require('react')
var ReactRouter = require('react-router')
var ReactDOMServer = require('react-dom/server')

var ServerApp = require('../public/build/es5/serverapp')
var store = require('../public/build/es5/stores/store')
var Home = require('../public/build/es5/components/layout/Home')
var Account = require('../public/build/es5/components/layout/Account')
var controllers = require('../controllers')

var templates = ['register']

matchRoutes = function(req, routes, initialStore){
	return new Promise(function(resolve, reject){
		ReactRouter.match({ routes, location: req.url }, function(error, redirectLocation, renderProps){
			if (error){
				reject(error)
				return
			}

			// if (redirectLocation){
			// 	return
			// }

			resolve(renderProps)
		})
	})
}

router.get('/', function(req, res, next) {

	var initialStore = null
	var reducers = {}

	var accountController = controllers.account
	accountController.currentUser(req)
	.then(function(user){
		reducers['accountReducer'] = {
			currentUser: user
		}

		initialStore = store.configureStore(reducers)

		var routes = {
			path: '/',
			component: ServerApp,
			initial: initialStore,
			indexRoute: {
				component: Home
			}
		}

		return matchRoutes(req, routes, initialStore)
	})
	.then(function(renderProps){
		var html = ReactDOMServer.renderToString(React.createElement(ReactRouter.RouterContext, renderProps))
	    res.render('index', {react: html, preloadedState:JSON.stringify(initialStore.getState())})		
	})
	.catch(function(err){

	})
})


// router.get('/', function(req, res, next) {

// 	var initialStore = null
// 	var reducers = {}

// 	var postController = controllers.post
// 	postController.get({}, function(err, results){

// 		var postsMap = {}
// 		for (var i=0; i<results.length; i++){
// 			var post = results[i]
// 			postsMap[post.id] = post
// 		}

// 		var postReducer = {
// 			posts: postsMap,
// 			postsArray: results
// 		}

// 		reducers['postReducer'] = postReducer
// 		initialStore = store.configureStore(reducers)

// 		var routes = {
// 			path: '/',
// 			component: ServerApp,
// 			initial: initialStore,
// 			indexRoute: {
// 				component: PostsContainer
// 			}
// 		}

// 		matchRoutes(req, routes, initialStore)
// 		.then(function(renderProps){
// 			var html = ReactDOMServer.renderToString(React.createElement(ReactRouter.RouterContext, renderProps))
// 		    res.render('index', {react: html, preloadedState:JSON.stringify(initialStore.getState())})
// 		})
// 		.catch(function(err){
// 			console.log('ERROR: '+err)
// 		})
// 	})
// })


router.get('/:page', function(req, res, next) {

	var page = req.params.page
	console.log('Request Page: '+page)

	if (templates.indexOf(page) >= 0){ // this is a regular template page
	    res.render(page, { title: 'Express' })

	    return
	}

	// react page
	var initialStore = null
	var reducers = {}

	var accountController = controllers.account
	accountController.currentUser(req)
	.then(function(user){
		reducers['accountReducer'] = {
			currentUser: user
		}

		initialStore = store.configureStore(reducers)

		var routes = {
			path: '/'+page,
			component: ServerApp,
			initial: initialStore,
			indexRoute: {
				component: Account
			}
		}

		return matchRoutes(req, routes, initialStore)
	})
	.then(function(renderProps){
		var html = ReactDOMServer.renderToString(React.createElement(ReactRouter.RouterContext, renderProps))
	    res.render('index', {react: html, preloadedState:JSON.stringify(initialStore.getState())})		
	})
	.catch(function(err){

	})
})

router.post('/:page', function(req, res, next) {

	var page = req.params.page
	console.log('Request Page: '+JSON.stringify(req.body))

	if (page == 'register'){
		var resp = req.body
		resp['confirmation'] = 'success'
		res.json(resp)
		return
	}
})

module.exports = router
