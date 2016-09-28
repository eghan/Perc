"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var APIManager = require("../../utils").APIManager;
var Loader = _interopRequire(require("react-loader"));

var actions = _interopRequire(require("../../actions/actions"));

var store = _interopRequire(require("../../stores/store"));

var browserHistory = require("react-router").browserHistory;
var styles = _interopRequire(require("../containers/Style"));

var Map = require("../view").Map;
var ManageNotifications = (function (Component) {
	function ManageNotifications(props, context) {
		_classCallCheck(this, ManageNotifications);

		_get(Object.getPrototypeOf(ManageNotifications.prototype), "constructor", this).call(this, props, context);
		this.state = {
			showLoader: false,
			notify: {
				bid: null,
				maxPrice: null,
				zones: [],
				status: "off"
			}
		};
	}

	_inherits(ManageNotifications, Component);

	_prototypeProperties(ManageNotifications, null, {
		mapClicked: {
			value: function mapClicked(latLng) {
				var _this = this;
				//		console.log('Map Clicked: '+JSON.stringify(latLng))
				APIManager.handlePost("/geo/reversegeocode", latLng, function (err, response) {
					if (err) {
						alert(err);
						return;
					}

					console.log("Reverse Geocode: " + JSON.stringify(response));
					var location = response.location;
					var zone = location.neighborhood == null ? location.zip : location.neighborhood;
					if (_this.state.notify.zones.indexOf(zone) != -1) {
						alert(zone + " already included");
						return;
					}

					var updatedNotify = Object.assign({}, _this.state.notify);
					var zones = Object.assign([], updatedNotify.zones);
					zones.push(zone);
					updatedNotify.zones = zones;
					_this.setState({
						notify: updatedNotify
					});
				});
			},
			writable: true,
			configurable: true
		},
		removeZip: {
			value: function removeZip(zone, event) {
				event.preventDefault();

				var updatedNotify = Object.assign({}, this.state.notify);
				var zones = Object.assign([], updatedNotify.zones);
				zones.splice(zones.indexOf(zone), 1);
				updatedNotify.zones = zones;
				this.setState({
					notify: updatedNotify
				});
			},
			writable: true,
			configurable: true
		},
		updateStatus: {
			value: function updateStatus(event) {
				var updatedNotify = Object.assign({}, this.state.notify);
				updatedNotify.status = event.target.value;
				this.setState({
					notify: updatedNotify
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var _this = this;
				var user = this.props.user;
				var notify = this.state.notify;
				var currentLocation = {
					lat: 40.7575285, lng: -73.9884469
				};

				var currentZones = notify.zones.map(function (zone, i) {
					return React.createElement(
						"div",
						{ key: i, style: { marginTop: 4 } },
						zone,
						React.createElement(
							"a",
							{ style: { float: "right" }, onClick: _this.removeZip.bind(_this, zone), href: "#" },
							"remove"
						)
					);
				});

				return React.createElement(
					"div",
					{ style: styles.container },
					React.createElement(Loader, { options: styles.loader, className: "loader", loaded: !this.state.showLoader, loadedClassName: "loadedContent" }),
					React.createElement(
						"h2",
						null,
						"Manage Notifications"
					),
					React.createElement("hr", null),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-6" },
							React.createElement(
								"h4",
								null,
								"Max Price & Bid"
							),
							React.createElement("input", { id: "maxPrice", style: styles.input, type: "text", placeholder: "Max Price of Apartment", defaultValue: notify.maxPrice }),
							React.createElement("input", { id: "bid", style: styles.input, type: "text", placeholder: "Bid for Each Notification", defaultValue: notify.bid }),
							React.createElement(
								"div",
								{ style: { background: "#f9f9f9", padding: 12, marginBottom: 12, border: "1px solid #ddd" } },
								React.createElement(
									"h4",
									{ className: "nobottommargin" },
									"Neighborhoods"
								),
								React.createElement(
									"p",
									null,
									"Click the map to select neighborhoods. You will be notified when a new apartment in selected neighborhood is posted."
								),
								currentZones
							),
							React.createElement(
								"select",
								{ value: notify.status, onChange: this.updateStatus.bind(this), style: { background: "#f9f9f9" }, className: "form-control" },
								React.createElement(
									"option",
									{ value: "off" },
									"Inactive"
								),
								React.createElement(
									"option",
									{ value: "on" },
									"Active"
								)
							)
						),
						React.createElement(
							"div",
							{ className: "col-md-6" },
							React.createElement(
								"div",
								{ style: { height: 550, marginTop: 16 } },
								React.createElement(Map, {
									center: currentLocation,
									mapClicked: this.mapClicked.bind(this),
									zoom: 13 })
							)
						)
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return ManageNotifications;
})(Component);

module.exports = ManageNotifications;