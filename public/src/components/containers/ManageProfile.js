import React, { Component } from 'react'

class ManageProfile extends Component {

	render(){
		const user = this.props.user
		return (
			<div style={styles.container}>
				<h2>Manage Profile</h2>
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

const styles = {
	container: {
		background:'#fff',
		padding: 24,
		border: '1px solid #ddd',
		marginTop: 16
	},
	input: {
		border:'none',
		borderBottom: '1px solid #eee',
		width: 100+'%',
		marginBottom: 20
	}
}


export default ManageProfile