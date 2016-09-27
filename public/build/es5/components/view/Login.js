"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var _reactBootstrap = require("react-bootstrap");

var ReactBootstrap = _interopRequire(_reactBootstrap);

var Modal = _reactBootstrap.Modal;
var Loader = _interopRequire(require("react-loader"));

var styles = _interopRequire(require("../view/Style"));

var Login = (function (Component) {
	function Login(props, context) {
		_classCallCheck(this, Login);

		_get(Object.getPrototypeOf(Login.prototype), "constructor", this).call(this, props, context);
		this.updateCredentials = this.updateCredentials.bind(this);
		this.login = this.login.bind(this);
		this.hide = this.hide.bind(this);
		this.state = {
			credentials: {
				email: "",
				password: ""
			}
		};
	}

	_inherits(Login, Component);

	_prototypeProperties(Login, null, {
		updateCredentials: {
			value: function updateCredentials(event) {
				var updatedCredentials = Object.assign({}, this.state.credentials);
				updatedCredentials[event.target.id] = event.target.value;

				this.setState({
					credentials: updatedCredentials
				});
			},
			writable: true,
			configurable: true
		},
		login: {
			value: function login(event) {
				//		console.log('LOGIN: '+JSON.stringify(this.state.credentials))
				this.props.login(this.state.credentials);
			},
			writable: true,
			configurable: true
		},
		hide: {
			value: function hide(event) {
				if (event != null) event.preventDefault();

				this.props.hide();
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				return React.createElement(
					"div",
					null,
					React.createElement(Loader, { options: styles.loader, loaded: !this.props.showLoader, className: "spinner", loadedClassName: "loadedContent" }),
					React.createElement(
						Modal,
						{ bsSize: "sm", show: this.props.isVisible, onHide: this.hide },
						React.createElement(
							Modal.Body,
							{ style: styles.modal },
							React.createElement(
								"div",
								{ style: { textAlign: "center" } },
								React.createElement("img", { style: styles.logo, src: "/images/logo_round_blue_260.png" }),
								React.createElement(
									"h4",
									null,
									"Log In"
								)
							),
							React.createElement("input", { onChange: this.updateCredentials, id: "email", className: "form-control", style: styles.textField, type: "text", placeholder: "Email" }),
							React.createElement("input", { onChange: this.updateCredentials, id: "password", className: "form-control", style: styles.textField, type: "password", placeholder: "Password" }),
							React.createElement(
								"div",
								{ style: styles.btnLoginContainer },
								React.createElement(
									"a",
									{ onClick: this.login, href: "#", className: "button button-border button-dark button-rounded button-large noleftmargin" },
									"Log In"
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

	return Login;
})(Component);

module.exports = Login;