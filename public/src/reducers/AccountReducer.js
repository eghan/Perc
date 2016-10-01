import constants from '../constants/constants'

var initial = {
	currentUser: {
		id: null,
	},
	posts: []
}

export default (state = initial, action) => {
	switch (action.type) {

		case constants.CURRENT_USER_RECEIVED:
			const currentUser = action.currentUser

//			console.log('CURRENT_USER_RECEIVED: '+JSON.stringify(currentUser))
			var newState = Object.assign({}, state)
			newState['currentUser'] = currentUser

			return newState

		case constants.USER_POSTS_RECEIVED:
//			console.log('USER_POSTS_RECEIVED: '+JSON.stringify(action.posts))
			var newState = Object.assign({}, state)
			newState['posts'] = action.posts

			return newState

		case constants.CURRENT_USER_UPDATE:
			var newState = Object.assign({}, state)
			newState['currentUser'] = action.currentUser
			return newState

		default:
			return state
	}

}