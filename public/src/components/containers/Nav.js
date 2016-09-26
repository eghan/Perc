import React, { Component } from 'react'
import { Login } from '../view'
import { APIManager } from '../../utils'
import { connect } from 'react-redux'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { Link } from 'react-router'

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
		const accountLink = (currentUser == null) ? <a onClick={this.toggleLogin} style={styles.menuItem} href="#">Login</a> : <Link style={styles.menuItem} to="/account">{ currentUser.firstName.toUpperCase() }</Link>
		return (
			<div style={styles.nav}>
				<a href="/register"><img src="/images/logo.png" style={{color:'#fff', marginLeft: 64}} /></a>
				<span>{accountLink}</span>
				<span><a style={styles.menuItem} href="/register">About</a></span>
				<span><Link style={styles.menuItem} to="/">Search</Link></span>
	            <Login isVisible={this.state.showLogin} hide={this.toggleLogin} login={this.login} redirect={'/account'} />
			</div>

		)
	}
}

const styles = {
	nav: {
		paddingTop: 16,
		paddingRight: 44,
		width: 100+'%',
		height: 64,
		background:'rgba(0,0,0,0.85)',
		position:'fixed',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 2,
		display: 'block'
	},
	menuItem: {
		float: 'right',
		color: '#fff',
		marginLeft: 40,
		fontWeight: 400,
		marginTop: 4
	}
}

const stateToProps = function(state){
	return {
		currentUser: state.accountReducer.currentUser
	}

}

export default connect(stateToProps)(Nav)