import React, { Component } from 'react'
import { APIManager } from '../../utils'
import { Map, Post, Login } from '../view'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { connect } from 'react-redux'

class Posts extends Component {
	constructor(props, context){
		super(props, context)
		this.toggleLogin = this.toggleLogin.bind(this)
		this.fetchPosts = this.fetchPosts.bind(this)
		this.selectPost = this.selectPost.bind(this)
		this.calculateDistance = this.calculateDistance.bind(this)
		this.mapMoved = this.mapMoved.bind(this)
		this.state = {
			currentLocation:{
				lat: 40.7575285, lng: -73.9884469
			}
		}
	}

	componentDidMount() {
		if (this.props.posts.length > 0)
			return

		this.fetchPosts(this.state.currentLocation)
	}

	toggleLogin(event){
		if (event != null)
			event.preventDefault()

		const showLogin = !this.state.showLogin
		this.setState({
			showLogin: showLogin
		})
	}

	selectPost(post){
		$('html, body').animate({
			scrollTop: $("#"+post.id).offset().top-200
		}, 750)

		this.setState({
			selected: post
		})
	}

	calculateDistance(location){
		const currentLocation = this.state.currentLocation
		const deltaX = currentLocation.lat-location.lat
		const deltaY = currentLocation.lng-location.lng
		var cSquared = (deltaY*deltaY) + (deltaX*deltaX)
		var dist = Math.sqrt(cSquared)
		return dist
	}

	mapMoved(location){
		const dist = this.calculateDistance(location)
		console.log('MAP MOVED: '+dist)
		if (dist < 0.02)
			return

		this.fetchPosts(location)
	}

	fetchPosts(location){
		this.setState({
			currentLocation: location
		})

		APIManager.handleGet('/api/post', location, function(err, response){
			if (err){
				alert('ERROR: '+err.message)
				return
			}

			store.currentStore().dispatch(actions.postsReceived(response.results))
		})
	}

	viewPost(post){
		console.log('ViewPost: '+JSON.stringify(post))

	}

	render(){
		const posts = this.props.posts
		const currentPosts = posts.map((post, i) => {
			const textColor = (this.props.selected == post) ? 'red' : '#000'
			return <Post key={post.id} post={post} color={textColor} clickHandler={this.viewPost.bind(this, post)} />
		})

		return (
			<div className="content-wrap container clearfix">
				{currentPosts}
			</div>
		)
	}
}

const styles = {
	nav: {
		paddingTop: 16,
		paddingRight: 44,
		textAlign:'right',
		width:'100%',
		height: 54,
		background:'rgba(0,0,0,0.7)',
		position:'fixed',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 2,
		display: 'block'
	},
	menuItem: {
		color:'#fff',
		marginLeft:48,
		fontWeight:200
	}
}

const stateToProps = function(state){
	return {
		posts: state.postReducer.postsArray
	}

}

export default connect(stateToProps)(Posts)


