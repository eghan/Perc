import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { APIManager } from '../../utils'
import Loader from 'react-loader'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { browserHistory } from 'react-router'
import styles from '../containers/Style'

class CreatePost extends Component {
	constructor(props, context){
		super(props, context)
		this.uploadImage = this.uploadImage.bind(this)
		this.state = {
			showLoader: false,
			post: {
				title: '',
				address: '',
				city: 'new york',
				state: 'ny',
				description: '',
				type: 'rental',
				price: '',
				image: '',
				images: [],
			}
		}
	}

	updatePost(event){
		const value = event.target.value
//		console.log('updatePost: '+value)

		var updatedPost = Object.assign({}, this.state.post)
		if (event.target.id == 'location'){
			var parts = value.split(',')
			updatedPost['city'] = parts[0].toLowerCase().trim()
			updatedPost['state'] = parts[1].toLowerCase().trim()
		}
		else {
			updatedPost[event.target.id] = value
		}

		this.setState({
			post: updatedPost
		})
	}

	submitPost(event){
		event.preventDefault()
		console.log('submitPost: '+JSON.stringify(this.state.post))
		var post = Object.assign({}, this.state.post)
		const user = this.props.user
		post['profile'] = {
			id: user.id,
			name: user.firstName,
			email: user.email
		}

		APIManager.handlePost('/api/post', post, (err, response) => {
			if (err){
				alert(err)
				return
			}

			console.log(JSON.stringify(response))
			const post = response.result
			store.currentStore().dispatch(actions.postsReceived([post]))
			browserHistory.push('/post/'+post.slug)
		})
	}

	uploadPrimaryImage(files){
		this.uploadImage(files, 'primary')
	}

	uploadSecondaryImage(files){
		this.uploadImage(files, 'secondary')
	}

	uploadImage(files, type){
		this.setState({showLoader: true})

		APIManager.upload(files[0], (err, response) => {
			this.setState({
				showLoader: false
			})

			if (err){
				alert(response.message)
				return
			}

			var updatedPost = Object.assign({}, this.state.post)
			if (type == 'primary')
				updatedPost['image'] = response.id
			else {
				var images = Object.assign([], updatedPost.images)
				images.push(response.id) 
				updatedPost['images'] = images
			}

			this.setState({
				post: updatedPost
			})
		})
	}

	render(){
		const user = this.props.user
		const post = this.state.post
		const primaryImage = (post.image.length == 0) ? null : <img style={{width:96, marginRight:12, marginTop:12}} src={'https://media-service.appspot.com/site/images/'+post.image+'?crop=260'} />
		const secondaryImages = post.images.map((image, i) => {
			return (
				<img key={image} style={styles.icon} src={'https://media-service.appspot.com/site/images/'+image+'?crop=260'} />
			)
		})

		return (
			<div style={styles.container}>
				<Loader options={styles.loader} className="loader" loaded={!this.state.showLoader} loadedClassName="loadedContent" />
				<h2>Create Listing</h2>
				<hr />
				<div className="row">
					<div className="col-md-6">
						<input id="title" onChange={this.updatePost.bind(this)} style={styles.input} type="text" placeholder="Title" defaultValue={post.title} />
						<input id="contact" onChange={this.updatePost.bind(this)} style={styles.input} type="text" placeholder="Email" defaultValue={post.contact} />
						<input id="price" onChange={this.updatePost.bind(this)} style={styles.input} type="text" placeholder="Price (USD)" defaultValue={post.contact} />
					</div>


					<div className="col-md-6">
						<input id="address" onChange={this.updatePost.bind(this)} style={styles.input} type="text" placeholder="Address" defaultValue={post.address} />
						<select id="location" onChange={this.updatePost.bind(this)} style={styles.select}>
							<option value="new york, ny">New York, NY</option>
							<option value="los angeles, ca">Los Angeles, CA</option>
							<option value="san francisco, ca">San Francisco, CA</option>
						</select>
						<select id="type" onChange={this.updatePost.bind(this)} style={styles.select}>
							<option value="rental">Apartment For Rent</option>
							<option value="job">Help Wanted</option>
						</select>

					</div>

					<div className="col-md-12">
						<textarea id="description" onChange={this.updatePost.bind(this)} style={styles.description} placeholder="Description" defaultValue={post.description}></textarea>

						<div className="row">
							<div className="col-md-4">
					            <Dropzone style={styles.upload} onDrop={this.uploadPrimaryImage.bind(this)}>
					              	Upload Primary Image Here<br />
					            	{primaryImage}
					            </Dropzone>
							</div>

							<div className="col-md-8">
					            <Dropzone style={styles.upload} onDrop={this.uploadSecondaryImage.bind(this)}>
					              	Upload Secondary Images Here (Limit 4)<br />
					              	{secondaryImages}
					            </Dropzone>
							</div>
						</div>

						<a onClick={this.submitPost.bind(this)} style={styles.btnNext} href="#" className="button button-border button-dark button-rounded noleftmargin">Create Post</a>
					</div>
				</div>
			</div>
		)
	}
}


export default CreatePost