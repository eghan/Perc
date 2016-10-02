var express = require('express')
var router = express.Router()

//require('node-jsx').install({ extension: ".js" })
var React = require('react')
var ReactRouter = require('react-router')
var ReactDOMServer = require('react-dom/server')

var ServerApp = require('../public/build/es5/serverapp')
var store = require('../public/build/es5/stores/store')
var Home = require('../public/build/es5/components/layout/Home')
var PostDetail = require('../public/build/es5/components/layout/PostDetail')
var Account = require('../public/build/es5/components/layout/Account')
var controllers = require('../controllers')

var templates = ['register']
var ignore = ['api', 'geo', 'account']

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
	var tags = {
		title: 'Search',
		type: 'article',
		description: '',
		image: ''
	}

	var accountController = controllers.account
	accountController.currentUser(req)
	.then(function(user){
		reducers['accountReducer'] = {
			currentUser: user,
			posts: []
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
	    res.render('index', {
	    	react: html,
	    	tags: tags,
	    	preloadedState:JSON.stringify(initialStore.getState())
	    })		
	})
	.catch(function(err){

	})
})

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
			currentUser: user,
			posts: []
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

router.get('/:page/:slug', function(req, res, next) {
	var page = req.params.page
	if (templates.indexOf(page) >= 0){ // this is a regular template page, render
	    res.render(page, null)
	    return
	}

	if (ignore.indexOf(page) >= 0){
	    next()
	    return
	}


	console.log('Request Page: '+page)

	// react page
	var initialStore = null
	var reducers = {}
	var tags = {}

	var accountController = controllers.account
	accountController.currentUser(req)
	.then(function(user){
		reducers['accountReducer'] = {
			currentUser: user,
			posts: []
		}

		var postController = controllers.post
		return postController.find({slug: req.params.slug}, false)

	})
	.then(function(posts){
		var postsMap = {}
		for (var i=0; i<posts.length; i++){
			var post = posts[i]
			postsMap[post.slug] = post
		}

		reducers['postReducer'] = {
			posts: postsMap,
			postsArray: posts
		}		

		initialStore = store.configureStore(reducers)

		var routes = {
			path: '/:page/:slug',
			component: ServerApp,
			initial: initialStore,
			indexRoute: {
				component: PostDetail
			}
		}

		var post = posts[0]
		var description = post.description
		if (description.length > 200)
			description = description.substring(0, 200)+'...'

		tags['title'] = post.title
		tags['url'] = req.protocol+'://'+req.headers.host+req.url
		tags['image'] = 'https://media-service.appspot.com/site/images/'+post.image+'?crop=260',
		tags['description'] = description

		return matchRoutes(req, routes, initialStore)
	})
	.then(function(renderProps){
		var html = ReactDOMServer.renderToString(React.createElement(ReactRouter.RouterContext, renderProps))
	    res.render('index', {
	    	react: html,
	    	tags: tags,
	    	preloadedState:JSON.stringify(initialStore.getState())
	    })		
	})
	.catch(function(err){

	})
})



module.exports = router
