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
			return (
				<div key={i} className="col-md-2">
					<img style={{marginTop:12}} src={'https://media-service.appspot.com/site/images/'+icon+'?crop=420'} />
				</div>
			)
		})

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
									<img style={styles.postImage} src={'https://media-service.appspot.com/site/images/'+post.image+'?crop=420'} />
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
		marginTop: 12
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


