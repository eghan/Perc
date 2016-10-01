import React, { Component } from 'react'
import Loader from 'react-loader'
import { Modal } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { APIManager, StripeUtils } from '../../utils'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { Map } from '../view'
import styles from '../containers/Style'


class ManageNotifications extends Component {
	constructor(props, context){
		super(props, context)
		this.state = {
			showModal: false,
			showLoader: false,
			notify: {
				bid: 0,
				maxPrice: null,
				zones: [],
				status: 'on',
				quantity: 0
			}
		}
	}

	mapClicked(latLng){
		APIManager.handlePost('/geo/reversegeocode', latLng, (err, response) => {
			if (err){
				alert(err)
				return
			}

			console.log('Reverse Geocode: '+JSON.stringify(response))
			const location = response.location
			const zone = (location.neighborhood==null) ? location.zip : location.neighborhood
			if (this.state.notify.zones.indexOf(zone) != -1){
				alert(zone+' already included')
				return
			}

			var updatedNotify = Object.assign({}, this.state.notify)
			var zones = Object.assign([], updatedNotify.zones)
			zones.push(zone)
			updatedNotify['zones'] = zones
			this.setState({
				notify: updatedNotify
			})
		})
	}

	removeZip(zone, event){
		event.preventDefault()

		var updatedNotify = Object.assign({}, this.state.notify)
		var zones = Object.assign([], updatedNotify.zones)
		zones.splice(zones.indexOf(zone), 1)
		updatedNotify['zones'] = zones
		this.setState({
			notify: updatedNotify
		})
	}

	updateStatus(event){
		var updatedNotify = Object.assign({}, this.state.notify)
		updatedNotify['status'] = event.target.value
		this.setState({
			notify: updatedNotify
		})
	}

	toggleModal(event){
		if (event != null)
			event.preventDefault()

		this.setState({
			showModal: !this.state.showModal
		})
	}

	purchase(event){
		event.preventDefault()
		var notify = Object.assign({}, this.state.notify)
		console.log('purchase: '+JSON.stringify(notify))

		this.setState({
			showModal: false
		})

		var amounts = {
			5: 5,
			10: 9,
			15: 12,
			20: 15
		}

		var stripeHandler = StripeUtils.initializeWithText('TEST', (token) => {
			this.setState({showLoader: true})

			const currentUser = this.props.currentUser
			const description = notify.quantity+' notifications'
			APIManager.submitStripeCharge(token, amounts[notify.quantity], description, currentUser, (err, response) => {
				this.setState({showLoader: false})
				if (err){
					alert(err.message)
					return
				}
				
				console.log('Stripe Charge: '+JSON.stringify(response))

//				const currentStore = store.currentStore()
//				this.setState({
//					showConfirmation: true
//				})

			})
		})

	    stripeHandler.open({
		    name: 'Perc',
		    description: notify.quantity+' notifications'
	    })
	}

	updatedNotify(event){
//		console.log('updatedNotify: '+event.target.id+' = '+event.target.value)
		var notify = Object.assign({}, this.state.notify)
		notify[event.target.id] = event.target.value
		this.setState({
			notify: notify
		})
	}

	updatedProfile(event){
		var user = Object.assign({}, this.props.currentUser)
		user[event.target.id] = event.target.value
		console.log('updatedProfile: '+JSON.stringify(user))

	}

	render(){
		const user = this.props.currentUser
		const notify = this.state.notify
		const currentLocation = {
			lat: 40.7575285, lng: -73.9884469
		}

		const currentZones = notify.zones.map((zone, i) => {
			return (
				<div key={i} style={{marginTop:4}}>
					{zone}
					<a style={{float:'right'}} onClick={this.removeZip.bind(this, zone)} href="#">remove</a>
				</div>
			)
		})

		return (
			<div style={styles.container}>
				<Loader options={styles.loader} className="loader" loaded={!this.state.showLoader} loadedClassName="loadedContent" />
				<h2>Manage Notifications</h2>
				<hr />

				<div className="row">
					<div className="col-md-6">
						<input id="email" onChange={this.updatedProfile.bind(this)} style={styles.input} type="text" placeholder="Email" />
						<input id="password" onChange={this.updatedProfile.bind(this)} style={styles.input} type="password" placeholder="Password" />
						<input id="phone" onChange={this.updatedProfile.bind(this)} style={styles.input} type="phone" placeholder="Phone (notifications are sent via text)" />
						<input id="maxPrice" onChange={this.updatedNotify.bind(this)} style={styles.input} type="text" placeholder="Max Price of Apartment" defaultValue={notify.maxPrice} />

						<div style={{background:'#f9f9f9', padding:12, marginBottom:12, border:'1px solid #ddd'}}>
							<h4 className="nobottommargin">Neighborhoods</h4>
							<p>
								Click the map to select neighborhoods. You will be notified when a new apartment 
								in selected neighborhood is posted.
							</p>
							{currentZones}
						</div>

						<a onClick={this.toggleModal.bind(this)} href="#" className="button button-border button-dark button-rounded noleftmargin">
							Next
						</a>
					</div>

					<div className="col-md-6">
						<div style={{height:550, marginTop:16}}>
			            	<Map 
			            		center={currentLocation}
			            		mapClicked={this.mapClicked.bind(this)}
			            		zoom={13} />
						</div>
					</div>
				</div>

		        <Modal bsSize="sm" show={this.state.showModal} onHide={this.toggleModal.bind(this)}>
			        <Modal.Body style={styles.modal}>
			        	<div style={{textAlign:'center'}}>
				        	<img style={styles.modal.image} src='/images/logo_round_blue_260.png' />
				        	<h4>Notifications</h4>
				        	<hr style={styles.modal.hr} />
				        	Your first three notifications are free. Afterwards, you can purchase notifcations in 
				        	sets of 5 from below:
				        	<div style={{textAlign:'left', marginLeft:32, marginRight:'auto', padding:16}}>
					        	<input id="quantity" style={styles.modal.input} onChange={this.updatedNotify.bind(this)} type="radio" name="quantity" value="5" />5 notifcations - $5<br />
					        	<input id="quantity" style={styles.modal.input} onChange={this.updatedNotify.bind(this)} type="radio" name="quantity" value="10" />10 notifcations - $9<br />
					        	<input id="quantity" style={styles.modal.input} onChange={this.updatedNotify.bind(this)} type="radio" name="quantity" value="15" />15 notifcations - $12<br />
					        	<input id="quantity" style={styles.modal.input} onChange={this.updatedNotify.bind(this)} type="radio" name="quantity" value="20" />20 notifcations - $15<br />
				        	</div>
							<a onClick={this.purchase.bind(this)} href="#" className="button button-border button-dark button-rounded button-large noleftmargin">Next</a>
						</div>
			        </Modal.Body>
		        </Modal>
			</div>			
		)

	}
}

const stateToProps = function(state){
	return {
		currentUser: state.accountReducer.currentUser
	}
}

export default connect(stateToProps)(ManageNotifications)


