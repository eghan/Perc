import React, { Component } from 'react'
import { Nav } from './containers'
import { APIManager } from '../utils'

class Main extends Component {
	componentDidMount(){
		console.log(this.props.location.pathname)

		let body = {
			path: this.props.location.pathname
		}

		APIManager.handlePost('/track', body, (err, response) => {
			if (err){
				console.log('ERROR: '+JSON.stringify(err))
				return
			}

			console.log(JSON.stringify(response))
		})
	}

	render(){
		return (
			<div className="stretched side-header">
				<Nav />
				<div id="wrapper">
					{this.props.children}
				</div>
				
			</div>
		)
	}
}

export default Main