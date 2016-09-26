import React, { Component } from 'react'
import { TextUtils } from '../../utils'
import { Link } from 'react-router'

class Post extends Component {
	constructor(props, context){
		super(props, context)
		this.state = {

		}
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
	                	<Link style={{color:this.props.color}} to={'/post/'+post.slug}>{post.title}</Link>
	                </h4>
	                <hr style={{marginBottom:0, marginTop:12}} />
	                <p className="list-group-item-text" style={styles.description}>
	                	{TextUtils.truncateText(post.description, 220)}
	                </p>
					<Link to={'/post/'+post.slug}  style={styles.btnView} className="button button-border button-dark button-rounded noleftmargin">View</Link>
					<Link to={'/post/'+post.slug} style={styles.btnView} className="button button-border button-dark button-rounded noleftmargin">${post.price}</Link>
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
		width: 224,
		marginRight: 16
	},
	postImageMobile: {
		width: 100+'%'
	},
	btnView: {
		float: 'right',
		marginBottom: 20,
		marginLeft: 24
	},
	description: {
		marginTop: 6,
		marginBottom: 20
	}
}

export default Post