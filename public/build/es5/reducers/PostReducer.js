"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

var intial = {
	posts: {},
	postsArray: []
};

module.exports = function (_x, action) {
	var state = arguments[0] === undefined ? intial : arguments[0];
	switch (action.type) {

		case constants.POSTS_RECEIVED:
			var posts = action.posts;
			//			console.log('POSTS_RECEIVED: '+JSON.stringify(posts))
			var newState = Object.assign({}, state);
			var array = Object.assign([], newState.postsArray);
			var postsMap = Object.assign({}, newState.postsArray);

			for (var i = 0; i < posts.length; i++) {
				var post = posts[i];
				postsMap[post.slug] = post;
				array.push(post);
			}

			newState.postsArray = array;
			newState.posts = postsMap;

			return newState;

		default:
			return state;


	}
};