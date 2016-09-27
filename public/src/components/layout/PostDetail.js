import React, { Component } from 'react'
import { APIManager, TextUtils, DateUtils } from '../../utils'
import { Map, Post } from '../view'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { connect } from 'react-redux'

class PostDetail extends Component {
	constructor(props, context){
		super(props, context)
		this.state = {
			markers: [],
			reply: {
				message: ''
			}
		}
	}

	componentDidMount(){
		window.scrollTo(0, 0)

		const post = this.props.posts[this.props.params.slug]
		var postArray = [post]
		this.setState({
			markers: postArray
		})
	}

	submitReply(event){
		event.preventDefault()
		const user = this.props.currentUser
		var reply = Object.assign({}, this.state.reply)
		reply['profile'] = {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email
		}

		const post = this.props.posts[this.props.params.slug]
		reply['recipient'] = {
			id: post.profile.id,
			firstName: post.profile.firstName,
			lastName: post.profile.lastName,
			email: post.contact
		}

		reply['subject'] = post.title

		APIManager.handlePost('/api/reply', reply, (err, result) => {
			if (err){
				alert(err)
				return
			}

			console.log('submitReply:'+JSON.stringify(result))
			alert('Notification Sent')
		})

	}

	updateReply(event){
//		console.log('updateReply:'+event.target.value)
		var updatedReply = Object.assign({}, this.state.reply)
		updatedReply['message'] = event.target.value
		this.setState({
			reply: updatedReply
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
				<header id="header" className="no-sticky">
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
							<hr />
							<div className="row">
								<div className="col-md-12">
									<textarea onChange={this.updateReply.bind(this)} style={styles.reply} placeholder="Reply"></textarea>
									<a onClick={this.submitReply.bind(this)} href="#" className="button button-border button-dark button-rounded noleftmargin">Submit</a>
								</div>
							</div>

						</div>

						<div style={styles.container}>
							<h2>Notifications</h2>
							<hr />
							<p>
								Get notified when the next listing similar this one gets posted.

							</p>

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
		marginBottom: 36
	},
	postImage: {
		width: 100+'%',
		marginTop: 12,
		border: '1px solid #ddd',
		padding: 8
	},
	description: {
		minHeight: 220
	},
	reply: {
		width:100+'%',
		background:'#f9f9f9',
		border:'1px solid #ddd',
		height: 160,
		padding: 12,
		marginBottom: 12
	}
}

const stateToProps = function(state){
	return {
		posts: state.postReducer.posts,
		currentUser: state.accountReducer.currentUser
	}

}

export default connect(stateToProps)(PostDetail)


