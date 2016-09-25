import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { APIManager } from '../../utils'

class CreatePost extends Component {
	constructor(props, context){
		super(props, context)
		this.uploadImage = this.uploadImage.bind(this)
		this.state = {
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
		console.log('updatePost: '+value)

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

		APIManager.handlePost('/api/post', this.state.post, (err, response) => {
			if (err){
				alert(err)
				return
			}

			console.log(JSON.stringify(response))
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

			console.log('UPLOAD IMAGE: '+JSON.stringify(response))

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
				<img style={styles.icon} src={'https://media-service.appspot.com/site/images/'+image+'?crop=260'} />
			)
		})

		return (
			<div style={styles.container}>
				<h2>Create Listing</h2>
				<div className="row">
					<div className="col-md-12">
						<input id="title" onChange={this.updatePost.bind(this)} style={styles.input} type="text" placeholder="Title" defaultValue={post.title} />
						<input id="email" onChange={this.updatePost.bind(this)} style={styles.input} type="text" placeholder="Email" defaultValue={post.contact} />
						<input id="price" onChange={this.updatePost.bind(this)} style={styles.input} type="text" placeholder="Price (USD)" defaultValue={post.contact} />
						<input id="address" onChange={this.updatePost.bind(this)} style={styles.input} type="text" placeholder="Address" defaultValue={post.address} />
						<select id="location" onChange={this.updatePost.bind(this)} style={{marginBottom:20}} className="form-control">
							<option value="new york, ny">New York, NY</option>
							<option value="los angeles, ca">Los Angeles, CA</option>
							<option value="san francisco, ca">San Francisco, CA</option>
						</select>
						<select id="type" onChange={this.updatePost.bind(this)} style={{marginBottom:20}} className="form-control">
							<option value="rental">Apartment For Rent</option>
							<option value="job">Help Wanted</option>
						</select>
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

const styles = {
	container: {
		background:'#fff',
		padding: 24,
		border: '1px solid #ddd',
		marginTop: 16
	},
	input: {
		border:'none',
		borderBottom: '1px solid #eee',
		width: 100+'%',
		marginBottom: 20
	},
	description: {
		width: 100+'%',
		marginBottom: 20,
		background: '#f9f9f9',
		borderColor: '#ddd',
		height: 160,
		padding: 12
	},
	btnNext: {
		float:'right',
		marginBottom: 20
	},
	upload: {
		width: 100+'%',
		marginBottom: 24,
		background: '#f9f9f9',
		border: '1px solid #ddd',
		color: '#777',
		minHeight: 180,
		padding: 16
	},
	icon: {
		width:64,
		marginRight:12,
		marginTop:12
	}
}


export default CreatePost