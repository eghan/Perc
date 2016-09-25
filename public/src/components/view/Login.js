import React, { Component } from 'react'
import ReactBootstrap, { Modal } from 'react-bootstrap'
import Loader from 'react-loader'

class Login extends Component {
	constructor(props, context){
		super(props, context)
		this.updateCredentials = this.updateCredentials.bind(this)
		this.login = this.login.bind(this)
		this.hide = this.hide.bind(this)
		this.state = {
			credentials: {
				email: '',
				password: ''
			}
		}
	}

	updateCredentials(event){
		var updatedCredentials = Object.assign({}, this.state.credentials)
		updatedCredentials[event.target.id] = event.target.value

		this.setState({
			credentials: updatedCredentials
		})
	}

	login(event){
//		console.log('LOGIN: '+JSON.stringify(this.state.credentials))
		this.props.login(this.state.credentials)

	}

	hide(event){
		if (event != null)
			event.preventDefault()
		
		this.props.hide()
	}

	render(){
		return (
			<div>
				<Loader options={styles.loader} loaded={!this.props.showLoader} className="spinner" loadedClassName="loadedContent" />
		        <Modal bsSize="sm" show={this.props.isVisible} onHide={this.hide}>
			        <Modal.Body style={styles.modal}>
			        	<div style={{textAlign:'center'}}>
				        	<img style={styles.logo} src='/images/logo_round_blue_260.png' />
				        	<h4>Log In</h4>
			        	</div>
			        	<input onChange={this.updateCredentials} id="email" className="form-control" style={styles.textField} type="text" placeholder="Email" />
			        	<input onChange={this.updateCredentials} id="password" className="form-control" style={styles.textField} type="password" placeholder="Password" />
						<div style={styles.btnLoginContainer}>
							<a onClick={this.login} href="#" className="button button-border button-dark button-rounded button-large noleftmargin">Log In</a>
						</div>
			        </Modal.Body>

		        </Modal>
			</div>
		)
	}
}

const styles = {
	modal: {
		background:'#f9f9f9',
		padding:24,
		borderRadius:3
	},
	btnLoginContainer: {
		textAlign:'center',
		marginTop:24
	},
	textField: {
		marginBottom:12
	},
	logo: {
		width:96,
		borderRadius:48,
		border:'1px solid #ddd',
		background:'#fff',
		marginBottom:24
	},
	loader: {
	    lines: 13,
	    length: 20,
	    width: 10,
	    radius: 30,
	    corners: 1,
	    rotate: 0,
	    direction: 1,
	    color: '#fff',
	    speed: 1,
	    trail: 60,
	    shadow: false,
	    hwaccel: false,
	    zIndex: 2e9,
	    top: '50%',
	    left: '50%',
	    scale: 1.00
	}	

}

export default Login