import React, {Component} from 'react'

// https://github.com/tomchentw/react-google-maps
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps'

class Map extends Component {
	constructor(props, context){
		super(props, context)
		this.handleMarkerClick = this.handleMarkerClick.bind(this)
		this.state = {
			map: null
		}
	}

	mapDragged(){
		var latLng = this.state.map.getCenter().toJSON()
		if (this.props.onCenterChanged != null)
			this.props.onCenterChanged(latLng)
	}

	handleMarkerClick(marker){
//		console.log('handleMarkerClick: '+JSON.stringify(marker))

		if (this.props.selectPost != null)
			this.props.selectPost(marker)
	}

	render(){
		var markers = null
		if (this.props.markers != null){
			markers = this.props.markers.map((marker, i) => {
				marker['defaultAnimation'] = 2
				marker['icon'] = '/images/icons/map-icon.png'
				marker['position'] = {
					lat: marker.geo[0],
					lng: marker.geo[1]
				}
				
		        return (
		            <Marker key={i} onClick={this.handleMarkerClick.bind(this, marker)} clickable={true} icon={marker.icon} label={marker.title} title={marker.key} {...marker} />
		        )
			})
		}

		const mapContainer = <div style={{height: '100%', width:'100%'}}></div>
		const zoom = (this.props.zoom==null) ? 15 : this.props.zoom

		return (
		    <GoogleMapLoader
		        containerElement = { mapContainer }
		        googleMapElement = {
			        <GoogleMap
			            ref={ (map) => {
				            	if (this.state.map != null)
				            		return
				            	
			            		this.setState({map: map})
			             	} 
			         	}
			            onDragend={this.mapDragged.bind(this)}
			            defaultZoom={zoom}
			            defaultCenter={this.props.center}
			            options={{streetViewControl: false, mapTypeControl: false}}>
			            { markers }
			        </GoogleMap>
		    	} />			

		)
	}
}



export default Map
