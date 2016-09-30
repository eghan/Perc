import React, { Component } from 'react'
import { Login } from '../view'
import { APIManager } from '../../utils'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { Link } from 'react-router'
import styles from '../containers/Style'

class Nav extends Component {
	constructor(props, context){
		super(props, context)
		this.toggleLogin = this.toggleLogin.bind(this)
		this.login = this.login.bind(this)
		this.state = {
			showLogin: false,			
		}
	}

	toggleLogin(event){
		if (event != null)
			event.preventDefault()

		const showLogin = !this.state.showLogin
		this.setState({
			showLogin: showLogin
		})
	}

	login(credentials){
		APIManager.handlePost('/account/login', credentials, (err, response) => {
			if (err){
				alert(err.message)
				return
			}

			this.setState({
				showLogin: false
			})

			store.currentStore().dispatch(actions.currentUserReceived(response.user))
		})
	}

	render(){
		const currentUser = this.props.currentUser
		const accountLink = (currentUser == null) ? <a onClick={this.toggleLogin} href="#"><div>Login</div></a> : <Link to="/account">{ currentUser.firstName.toUpperCase() }</Link>
		return (
			<div id="page-menu">
				<div id="page-menu-wrap">
					<div className="container clearfix">
						<div className="menu-title">
							<a href="/"><img style={{marginBottom:6}} src="/images/logo.png" /></a>
						</div>
						<nav className="one-page-menu">
							<ul>
								<li><Link to="/"><div>Search</div></Link></li>
								<li>{accountLink}</li>
							</ul>
						</nav>
						<div id="page-submenu-trigger"><i className="icon-reorder"></i></div>
					</div>
				</div>
	            <Login isVisible={this.state.showLogin} hide={this.toggleLogin} login={this.login} redirect={'/account'} />
			</div>

		)
	}
}

const stateToProps = function(state){
	return {
		currentUser: state.accountReducer.currentUser
	}

}

export default connect(stateToProps)(Nav)