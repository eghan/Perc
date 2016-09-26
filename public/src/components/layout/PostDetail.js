import React, { Component } from 'react'
import { APIManager, TextUtils } from '../../utils'
import { Map, Post } from '../view'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { connect } from 'react-redux'

class PostDetail extends Component {
	constructor(props, context){
		super(props, context)
		this.state = {
			markers: []

		}
	}

	componentDidMount(){
		const post = this.props.posts[this.props.params.slug]
		var postArray = [post]
		this.setState({
			markers: postArray
		})
	}

	render(){
		const post = this.props.posts[this.props.params.slug]
		const postLocation = {
			lat: post.geo[0],
			lng: post.geo[1]
		}

		const icons = post.images.map((icon, i) => {
			const url = 'https://media-service.appspot.com/site/images/'+icon
			return (
				<div key={i} className="col-md-2">
					<a href={url} target="_blank" className="left-icon" data-lightbox="image">
						<img style={{marginTop:12}} src={url+'?crop=420'} />
					</a>
				</div>
			)
		})

		const imageUrl = 'https://media-service.appspot.com/site/images/'+post.image

		return (
			<div className="clearfix">
				<header id="header" className="no-sticky" style={{marginTop:64}}>
		            <div id="header-wrap">
		            	<Map 
		            		center={postLocation}
		            		onCenterChanged={this.mapMoved} markers={this.state.markers} />
		            </div>
		        </header>

				<section id="content">
					<div className="content-wrap container clearfix">
						<div style={styles.container}>
							<h2>{post.title}</h2>
							<hr />
							<div className="row">
								<div className="col-md-8">
									<p dangerouslySetInnerHTML={{__html: TextUtils.convertToHtml(post.description) }}></p>
									<div className="row">{icons}</div>
								</div>
								<div className="col-md-4">
								<a href={imageUrl} target="_blank" className="left-icon" data-lightbox="image">
									<img style={styles.postImage} src={imageUrl+'?crop=420'} />
								</a>

								</div>
							</div>

						</div>
					</div>

				</section>
			</div>
		)
	}
}

const styles = {
	container: {
		background:'#fff',
		padding: 24,
		border: '1px solid #ddd',
		marginTop: 16
	},
	postImage: {
		width: 100+'%',
		marginTop: 12,
		border: '1px solid #ddd',
		padding: 8
	},
	description: {
		minHeight: 220
	}
}

const stateToProps = function(state){
	return {
		posts: state.postReducer.posts
	}

}

export default connect(stateToProps)(PostDetail)


