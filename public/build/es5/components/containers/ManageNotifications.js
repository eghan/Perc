"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var Loader = _interopRequire(require("react-loader"));

var Modal = require("react-bootstrap").Modal;
var browserHistory = require("react-router").browserHistory;
var connect = require("react-redux").connect;
var _utils = require("../../utils");

var APIManager = _utils.APIManager;
var StripeUtils = _utils.StripeUtils;
var actions = _interopRequire(require("../../actions/actions"));

var store = _interopRequire(require("../../stores/store"));

var Map = require("../view").Map;
var styles = _interopRequire(require("../containers/Style"));

var ManageNotifications = (function (Component) {
	function ManageNotifications(props, context) {
		_classCallCheck(this, ManageNotifications);

		_get(Object.getPrototypeOf(ManageNotifications.prototype), "constructor", this).call(this, props, context);
		this.state = {
			showModal: false,
			showLoader: false,
			user: { // use only if currentUser not registered
				email: "",
				password: ""
			},
			notify: {
				bid: 0,
				maxPrice: null,
				zones: [],
				status: "on",
				quantity: 0
			}
		};
	}

	_inherits(ManageNotifications, Component);

	_prototypeProperties(ManageNotifications, null, {
		mapClicked: {
			value: function mapClicked(latLng) {
				var _this = this;
				APIManager.handlePost("/geo/reversegeocode", latLng, function (err, response) {
					if (err) {
						alert(err);
						return;
					}

					//			console.log('Reverse Geocode: '+JSON.stringify(response))
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
		toggleModal: {
			value: function toggleModal(event) {
				if (event != null) event.preventDefault();

				this.setState({
					showModal: !this.state.showModal
				});
			},
			writable: true,
			configurable: true
		},
		purchase: {
			value: function purchase(event) {
				var _this = this;
				event.preventDefault();
				var notify = Object.assign({}, this.state.notify);
				//		console.log('purchase: '+JSON.stringify(notify))

				this.setState({
					showModal: false
				});

				var amounts = {
					0: 0,
					5: 5,
					10: 9,
					15: 12,
					20: 15
				};

				var currentUser = this.props.currentUser == null ? this.state.user : this.props.currentUser;
				currentUser.notify = notify;
				var qty = notify.quantity;

				if (qty == 0) {
					// standard registration, skip stripe
					this.setState({ showLoader: true });
					APIManager.handlePost("/account/register", currentUser, function (err, response) {
						if (err) {
							_this.setState({ showLoader: false });
							alert(err);
							return;
						}

						window.location.href = "/account";
					});

					return;
				}

				var amount = amounts[qty]; // amount to charge
				var stripeHandler = StripeUtils.initializeWithText("Purchase Notifications", function (token) {
					_this.setState({ showLoader: true });

					var description = qty + " notifications";
					APIManager.submitStripeCharge(token, amount, description, currentUser, function (err, response) {
						if (err) {
							alert(err.message);
							return;
						}

						window.location.href = "/account";
					});
				});

				stripeHandler.open({
					name: "Perc",
					description: qty + " notifications"
				});
			},
			writable: true,
			configurable: true
		},
		updateNotify: {
			value: function updateNotify(event) {
				//		console.log('updatedNotify: '+event.target.id+' = '+event.target.value)
				var notify = Object.assign({}, this.state.notify);
				notify[event.target.id] = event.target.value;
				this.setState({
					notify: notify
				});
			},
			writable: true,
			configurable: true
		},
		updateProfile: {
			value: function updateProfile(event) {
				var user = Object.assign({}, this.state.user);
				//		console.log('updateProfile: '+JSON.stringify(user))
				user[event.target.id] = event.target.value;

				this.setState({
					user: user
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var _this = this;
				var user = this.props.currentUser;
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

				var registrationForm = null;
				if (user == null) {
					registrationForm = React.createElement(
						"div",
						null,
						React.createElement("input", { id: "email", onChange: this.updateProfile.bind(this), style: styles.input, type: "text", placeholder: "Email" }),
						React.createElement("input", { id: "password", onChange: this.updateProfile.bind(this), style: styles.input, type: "password", placeholder: "Password" }),
						React.createElement("input", { id: "phone", onChange: this.updateProfile.bind(this), style: styles.input, type: "phone", placeholder: "Phone (notifications are sent via text)" })
					);
				}


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
							registrationForm,
							React.createElement("input", { id: "maxPrice", onChange: this.updateNotify.bind(this), style: styles.input, type: "text", placeholder: "Max Price of Apartment", defaultValue: notify.maxPrice }),
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
								"a",
								{ onClick: this.toggleModal.bind(this), href: "#", className: "button button-border button-dark button-rounded noleftmargin" },
								"Next"
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
					),
					React.createElement(
						Modal,
						{ bsSize: "sm", show: this.state.showModal, onHide: this.toggleModal.bind(this) },
						React.createElement(
							Modal.Body,
							{ style: styles.modal },
							React.createElement(
								"div",
								{ style: { textAlign: "center" } },
								React.createElement("img", { style: styles.modal.image, src: "/images/logo_round_blue_260.png" }),
								React.createElement(
									"h4",
									null,
									"Notifications"
								),
								React.createElement("hr", { style: styles.modal.hr }),
								"Your first three notifications are free. Afterwards, you can purchase notifcations in sets of 5 from below:",
								React.createElement(
									"div",
									{ style: { textAlign: "left", marginLeft: 32, marginRight: "auto", padding: 16 } },
									React.createElement("input", { id: "quantity", style: styles.modal.input, onChange: this.updateNotify.bind(this), type: "radio", name: "quantity", value: "5" }),
									"5 notifcations - $5",
									React.createElement("br", null),
									React.createElement("input", { id: "quantity", style: styles.modal.input, onChange: this.updateNotify.bind(this), type: "radio", name: "quantity", value: "10" }),
									"10 notifcations - $9",
									React.createElement("br", null),
									React.createElement("input", { id: "quantity", style: styles.modal.input, onChange: this.updateNotify.bind(this), type: "radio", name: "quantity", value: "15" }),
									"15 notifcations - $12",
									React.createElement("br", null),
									React.createElement("input", { id: "quantity", style: styles.modal.input, onChange: this.updateNotify.bind(this), type: "radio", name: "quantity", value: "20" }),
									"20 notifcations - $15",
									React.createElement("br", null)
								),
								React.createElement(
									"a",
									{ onClick: this.purchase.bind(this), href: "#", className: "button button-border button-dark button-rounded button-large noleftmargin" },
									"Next"
								),
								React.createElement(
									"a",
									{ onClick: this.purchase.bind(this), href: "#", className: "button button-border button-dark button-rounded button-large noleftmargin" },
									"Skip"
								)
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

var stateToProps = function (state) {
	return {
		currentUser: state.accountReducer.currentUser
	};
};

module.exports = connect(stateToProps)(ManageNotifications);