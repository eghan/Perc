import constants from '../constants/constants'

var intial = {
	posts: {},
	postsArray: []
}

export default (state = intial, action) => {
	switch (action.type) {

		case constants.POSTS_RECEIVED:
			const posts = action.posts
//			console.log('POSTS_RECEIVED: '+JSON.stringify(posts))
			var newState = Object.assign({}, state)
			var array = Object.assign([], newState.postsArray)
			var postsMap = Object.assign({}, newState.postsArray)

			for (var i=0; i<posts.length; i++){
				var post = posts[i]
				postsMap[post.slug] = post
				array.push(post)
			}

			newState['postsArray'] = array
			newState['posts'] = postsMap

			return newState

		default:
			return state


	}

}