import React, { Component } from 'react'
import { APIManager } from '../../utils'
import { Nav, ManageProfile, Posts, CreatePost } from '../containers'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { connect } from 'react-redux'
import styles from '../layout/Style'

class Account extends Component {
	constructor(props, context){
		super(props, context)
		this.state = {
			selected: 0,
			menuItems: [
				{name:'Profile', component:ManageProfile},
				{name:'Listings', component:Posts},
				{name:'Submit Listing', component:CreatePost}
			]
		}
	}

	selectItem(index, event){
		event.preventDefault()

		const item = this.state.menuItems
		this.setState({
			selected: index
		})
	}

	render(){
		const user = this.props.currentUser

		const sideMenu = this.state.menuItems.map((item, i) => {
			const style = (i == this.state.selected) ? styles.selected : styles.menuItem
			return (
				<li key={i}>
					<div style={style}>
						<a onClick={this.selectItem.bind(this, i)} href="#"><div>{item.name}</div></a>
					</div>
				</li>
			)
		})

		const selected = this.state.menuItems[this.state.selected]

		return (
			<div className="clearfix">
				<header id="header" className="no-sticky">
		            <div id="header-wrap">
						<div className="container clearfix">

							<nav id="primary-menu" style={{paddingTop:96}}>
								<ul>{sideMenu}</ul>
							</nav>

			            </div>
		            </div>
		        </header>

				<section id="content">
					<div className="content-wrap container clearfix">
						<selected.component user={user} />

					</div>
				</section>
			</div>
		)
	}
}


const stateToProps = function(state){
	return {
		currentUser: state.accountReducer.currentUser

	}

}

export default connect(stateToProps)(Account)


