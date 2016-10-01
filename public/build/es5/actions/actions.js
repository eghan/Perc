"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var constants = _interopRequire(require("../constants/constants"));

module.exports = {

	currentUserReceived: function (user) {
		return {
			type: constants.CURRENT_USER_RECEIVED,
			currentUser: user
		};
	},

	currentUserUpdate: function (user) {
		return {
			type: constants.CURRENT_USER_UPDATE,
			currentUser: user
		};
	},

	postsReceived: function (posts) {
		return {
			type: constants.POSTS_RECEIVED,
			posts: posts
		};
	},

	userPostsReceived: function (posts) {
		return {
			type: constants.USER_POSTS_RECEIVED,
			posts: posts
		};
	}

};