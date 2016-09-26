import constants from '../constants/constants'

export default {

	currentUserReceived: (user) => {
		return {
			type: constants.CURRENT_USER_RECEIVED,
			currentUser: user
		}
	},

	postsReceived: (posts) => {
		return {
			type: constants.POSTS_RECEIVED,
			posts: posts
		}
	},

	userPostsReceived: (posts) => {
		return {
			type: constants.USER_POSTS_RECEIVED,
			posts: posts
		}
	}

}