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
			newState['postsArray'] = posts

			var postsMap = Object.assign({}, newState.posts)

			for (var i=0; i<posts.length; i++){
				var post = posts[i]
				postsMap[post.slug] = post
			}

			newState['posts'] = postsMap

			return newState

		default:
			return state


	}

}