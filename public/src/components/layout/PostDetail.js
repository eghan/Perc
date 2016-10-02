import React, { Component } from 'react'
import { APIManager, TextUtils, DateUtils } from '../../utils'
import { Map, Post } from '../view'
import { ManageNotifications } from '../containers'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { connect } from 'react-redux'
import styles from '../layout/Style'

class PostDetail extends Component {
	constructor(props, context){
		super(props, context)
		this.state = {
			showModal: false,
			markers: [],
			showManageNotifications: false,
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
		var reply = Object.assign({}, this.state.reply)

		const user = this.props.currentUser
		if (user != null){
			reply['profile'] = {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email
			}
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

	toggleManageNotifications(event){
		event.preventDefault()
		this.setState({
			showManageNotifications: !this.state.showManageNotifications
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

		let notifcations = null
		if (this.state.showManageNotifications){
			notifcations = <ManageNotifications user={this.props.currentUser} />
		}
		else {
			notifcations = (
				<div style={styles.container}>
					<h2>Notifications</h2>
					<hr />

					<div className="row">
						<div className="col-md-6">
							<h4 className="nobottommargin">Never Lose an Apartment</h4>
							<p style={{marginTop:6}}>
								The apartment search in large cities like New York is extremely 
								competitive. Often, an apartment is rented merely hours after 
								it is posted on a search board simply because someone else got to 
								it first. On Perc, you can hear about apartments 
								before anyone else by signing up for notifications.
							</p>
							<a onClick={this.toggleManageNotifications.bind(this)} href="#" className="button button-border button-dark button-rounded noleftmargin">
								Set Up Notifications
							</a>
						</div>
						<div className="col-md-6">
							<h4 className="nobottommargin">How it Works</h4>
							<ol style={{padding:16, paddingLeft:32, fontWeight:200, background:'#f9f9f9', marginTop:6}}>
								<li>Specify the apartments you want to know about according to price and location.</li>
								<li>Purchase notifications.</li>
								<li>
									When a new apartment in your specified price and location is posted, you will receive
									notifications via email and text.
								</li>
							</ol>
						</div>
					</div>
				</div>
			)
		}

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
							<span style={{float:'right', fontWeight:800, fontSize:20}}>${post.price}</span>
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
									<textarea onChange={this.updateReply.bind(this)} style={styles.reply} placeholder="Reply. Include contact info."></textarea>
									<a onClick={this.submitReply.bind(this)} href="#" className="button button-border button-dark button-rounded noleftmargin">Submit</a>
								</div>
							</div>
						</div>

						{notifcations}
					</div>
				</section>

			</div>
		)
	}
}

const stateToProps = function(state){
	return {
		posts: state.postReducer.posts,
		currentUser: state.accountReducer.currentUser
	}

}

export default connect(stateToProps)(PostDetail)


