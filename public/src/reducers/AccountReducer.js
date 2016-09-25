import constants from '../constants/constants'

var initial = {
	currentUser: {
		id: null
	}
}

export default (state = initial, action) => {
	switch (action.type) {

		case constants.CURRENT_USER_RECEIVED:
			const currentUser = action.currentUser

			console.log('CURRENT_USER_RECEIVED: '+JSON.stringify(currentUser))
			var newState = Object.assign({}, state)
			newState['currentUser'] = currentUser

			return newState

		default:
			return state
	}

}