import React, { Component } from 'react'
import { APIManager } from '../../utils'
import Loader from 'react-loader'
import actions from '../../actions/actions'
import store from '../../stores/store'
import { browserHistory } from 'react-router'
import styles from '../containers/Style'
import { Map } from '../view'


class ManageNotifications extends Component {
	constructor(props, context){
		super(props, context)
		this.state = {
			showLoader: false,
			notify: {
				bid: null,
				maxPrice: null,
				zones: [],
				status: 'off'
			}
		}
	}

	mapClicked(latLng){
//		console.log('Map Clicked: '+JSON.stringify(latLng))
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

	render(){
		const user = this.props.user
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
						<h4>Max Price & Bid</h4>
						<input id="maxPrice" style={styles.input} type="text" placeholder="Max Price of Apartment" defaultValue={notify.maxPrice} />
						<input id="bid" style={styles.input} type="text" placeholder="Bid for Each Notification" defaultValue={notify.bid} />

						<div style={{background:'#f9f9f9', padding:12, marginBottom:12, border:'1px solid #ddd'}}>
							<h4 className="nobottommargin">Neighborhoods</h4>
							<p>
								Click the map to select neighborhoods. You will be notified when a new apartment 
								in selected neighborhood is posted.
							</p>
							{currentZones}
						</div>

						<select value={notify.status} onChange={this.updateStatus.bind(this)} style={{background:'#f9f9f9'}} className="form-control">
							<option value="off">Inactive</option>
							<option value="on">Active</option>
						</select>


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

			</div>			
		)

	}
}

export default ManageNotifications