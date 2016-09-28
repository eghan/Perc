import React, { Component } from 'react'
import styles from '../containers/Style'

class ManageProfile extends Component {

	render(){
		const user = this.props.user
		return (
			<div style={styles.container}>
				<h2>Manage Profile</h2>
				<hr />
				<div className="row">
					<div className="col-md-6">
						<input style={styles.input} type="text" defaultValue={user.firstName} />
					</div>
					<div className="col-md-6">
						<input style={styles.input} type="text" defaultValue={user.lastName} />
					</div>
				</div>

				<div className="row">
					<div className="col-md-6">
						<input style={styles.input} type="text" defaultValue={user.firstName} />
					</div>
					<div className="col-md-6">
						<input style={styles.input} type="text" defaultValue={user.lastName} />
					</div>
				</div>

			</div>
		)
	}
}


export default ManageProfile
