import React, { Component } from 'react'
import { APIManager } from '../../utils'
import { Map, Post, Login } from '../view'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'


class Posts extends Component {
	constructor(props, context){
		super(props, context)
		this.toggleLogin = this.toggleLogin.bind(this)
		this.fetchPosts = this.fetchPosts.bind(this)
		this.state = {

		}
	}

	componentDidMount() {
		if (this.props.user != null) {
			if (this.props.userPosts.length == 0)
				this.fetchPosts({notified:this.props.user.id})
			return
		}

		// home page, always re-query
		this.fetchPosts(this.props.location)
	}

	toggleLogin(event){
		if (event != null)
			event.preventDefault()

		const showLogin = !this.state.showLogin
		this.setState({
			showLogin: showLogin
		})
	}

	fetchPosts(params){
		APIManager.handleGet('/api/post', params, (err, response) => {
			if (err){
				alert('ERROR: '+err.message)
				return
			}

			if (this.props.user != null) { 
				store.currentStore().dispatch(actions.userPostsReceived(response.results))
			}

			if (this.props.location != null) { 
				store.currentStore().dispatch(actions.postsReceived(response.results))
			}
		})
	}

	render(){
		const posts = (this.props.user == null) ? this.props.posts : this.props.userPosts

		const currentPosts = posts.map((post, i) => {
			const textColor = (this.props.selected == post) ? 'red' : '#000'
			return <Post key={post.id} post={post} color={textColor} />
		})

		return (
			<div className="content-wrap container clearfix">
				{currentPosts}
			</div>
		)
	}
}


const stateToProps = function(state){
	return {
		userPosts: state.accountReducer.posts,
		posts: state.postReducer.postsArray
	}
}

export default connect(stateToProps)(Posts)


