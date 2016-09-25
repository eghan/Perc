"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var Login = require("../view").Login;
var APIManager = require("../../utils").APIManager;
var connect = require("react-redux").connect;
var actions = _interopRequire(require("../../actions/actions"));

var store = _interopRequire(require("../../stores/store"));

var Link = require("react-router").Link;
var Nav = (function (Component) {
	function Nav(props, context) {
		_classCallCheck(this, Nav);

		_get(Object.getPrototypeOf(Nav.prototype), "constructor", this).call(this, props, context);
		this.toggleLogin = this.toggleLogin.bind(this);
		this.login = this.login.bind(this);
		this.state = {
			showLogin: false };
	}

	_inherits(Nav, Component);

	_prototypeProperties(Nav, null, {
		toggleLogin: {
			value: function toggleLogin(event) {
				if (event != null) event.preventDefault();

				var showLogin = !this.state.showLogin;
				this.setState({
					showLogin: showLogin
				});
			},
			writable: true,
			configurable: true
		},
		login: {
			value: function login(credentials) {
				var _this = this;
				APIManager.handlePost("/account/login", credentials, function (err, response) {
					if (err) {
						alert(err.message);
						return;
					}

					_this.setState({
						showLogin: false
					});

					store.currentStore().dispatch(actions.currentUserReceived(response.user));
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var currentUser = this.props.currentUser;
				var accountLink = currentUser == null ? React.createElement(
					"a",
					{ onClick: this.toggleLogin, style: styles.menuItem, href: "#" },
					"Login"
				) : React.createElement(
					Link,
					{ style: styles.menuItem, to: "/account" },
					currentUser.firstName.toUpperCase()
				);
				return React.createElement(
					"div",
					{ style: styles.nav },
					React.createElement(
						"span",
						null,
						React.createElement(
							"a",
							{ style: styles.menuItem, href: "/" },
							"Home"
						)
					),
					React.createElement(
						"span",
						null,
						accountLink
					),
					React.createElement(Login, { isVisible: this.state.showLogin, hide: this.toggleLogin, login: this.login, redirect: "/account" })
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Nav;
})(Component);

var styles = {
	nav: {
		paddingTop: 20,
		paddingRight: 44,
		textAlign: "right",
		width: 100 + "%",
		height: 64,
		background: "rgba(0,0,0,0.85)",
		position: "fixed",
		top: 0,
		left: 0,
		right: 0,
		zIndex: 2,
		display: "block"
	},
	menuItem: {
		color: "#fff",
		marginLeft: 64,
		fontWeight: 200
	}
};

var stateToProps = function (state) {
	return {
		currentUser: state.accountReducer.currentUser
	};
};

module.exports = connect(stateToProps)(Nav);