import React, { Component } from 'react'
import { APIManager } from '../../utils'
import { Map, Post } from '../view'
import { Posts } from '../containers'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { connect } from 'react-redux'

class Home extends Component {
	constructor(props, context){
		super(props, context)
		this.fetchPosts = this.fetchPosts.bind(this)
		this.selectPost = this.selectPost.bind(this)
		this.calculateDistance = this.calculateDistance.bind(this)
		this.mapMoved = this.mapMoved.bind(this)
		this.state = {
			showLogin: false,
			selected: null,
			currentLocation: {
				lat: 40.7575285, lng: -73.9884469
			}
		}
	}

	selectPost(post){
//		console.log('selectPost: '+post.id)
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
//		console.log('MAP MOVED: '+dist)
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
				alert(err.message)
				return
			}

			store.currentStore().dispatch(actions.postsReceived(response.results))
		})
	}

	render(){
		const currentLocation = this.state.currentLocation

		return (
			<div className="clearfix">
				<header id="header" className="no-sticky">
		            <div id="header-wrap">
		            	<Map 
		            		center={currentLocation}
		            		zoom={13}
		            		onCenterChanged={this.mapMoved}
		            		selectPost={this.selectPost}
		            		markers={this.props.posts} />
		            </div>
		        </header>

				<section id="content">
					<Posts selected={this.state.selected} location={currentLocation} />
				</section>
			</div>
		)
	}
}


const stateToProps = function(state){
	return {
		posts: state.postReducer.postsArray
	}

}

export default connect(stateToProps)(Home)


