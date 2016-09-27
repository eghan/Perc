import React, { Component } from 'react'
import ReactBootstrap, { Modal } from 'react-bootstrap'
import Loader from 'react-loader'
import styles from '../view/Style'


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


export default Login