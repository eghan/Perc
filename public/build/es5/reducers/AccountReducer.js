"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

var initial = {
	currentUser: {
		id: null },
	posts: []
};

module.exports = function (_x, action) {
	var state = arguments[0] === undefined ? initial : arguments[0];
	switch (action.type) {

		case constants.CURRENT_USER_RECEIVED:
			var currentUser = action.currentUser;

			//			console.log('CURRENT_USER_RECEIVED: '+JSON.stringify(currentUser))
			var newState = Object.assign({}, state);
			newState.currentUser = currentUser;

			return newState;

		case constants.USER_POSTS_RECEIVED:
			//			console.log('USER_POSTS_RECEIVED: '+JSON.stringify(action.posts))
			var newState = Object.assign({}, state);
			newState.posts = action.posts;

			return newState;

		default:
			return state;
	}
};