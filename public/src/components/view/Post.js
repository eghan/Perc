import React, { Component } from 'react'

class Post extends Component {
	constructor(props, context){
		super(props, context)
		this.state = {

		}
	}

	viewPost(event){
		event.preventDefault()
		this.props.clickHandler(this.props.post)
	}

	render(){
		const post = this.props.post
		const image = 'https://media-service.appspot.com/site/images/'+post.image+'?crop=420'
		return (
            <div id={post.id} style={styles.container} className="clearfix">
	            <img className="hidden-xs" style={styles.postImage} src={image} />
	            <img className="visible-xs" style={styles.postImageMobile} src={image} />
	            <div style={{padding:16}}>
	                <h4 className="list-group-item-heading">
	                	<a onClick={this.viewPost.bind(this)} style={{color:this.props.color}} href={'/post/'+post.slug}>{post.title}</a>
	                </h4>
	                <hr style={{marginBottom:0, marginTop:12}} />
	                <p className="list-group-item-text" style={styles.description}>
	                	{post.description}
	                </p>
					<a onClick={this.viewPost.bind(this)} style={styles.btnView} href={'/post/'+post.slug} className="button button-border button-dark button-rounded noleftmargin">View</a>
	            </div>
            </div>
		)
	}
}

const styles = {
	container: {
		background:'#fff',
		marginTop:16,
		border:'1px solid #ddd'
	},
	postImage: {
		float:'left',
		width:180,
		marginRight:16
	},
	postImageMobile: {
		width: 100+'%'
	},
	btnView: {
		float:'right',
		marginBottom: 20
	},
	description: {
		marginTop: 6,
		marginBottom: 20
	}
}

export default Post