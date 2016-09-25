"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var ManageProfile = (function (Component) {
	function ManageProfile() {
		_classCallCheck(this, ManageProfile);

		if (Component != null) {
			Component.apply(this, arguments);
		}
	}

	_inherits(ManageProfile, Component);

	_prototypeProperties(ManageProfile, null, {
		render: {
			value: function render() {
				var user = this.props.user;
				return React.createElement(
					"div",
					{ style: styles.container },
					React.createElement(
						"h2",
						null,
						"Manage Profile"
					),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-6" },
							React.createElement("input", { style: styles.input, type: "text", defaultValue: user.firstName })
						),
						React.createElement(
							"div",
							{ className: "col-md-6" },
							React.createElement("input", { style: styles.input, type: "text", defaultValue: user.lastName })
						)
					),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-6" },
							React.createElement("input", { style: styles.input, type: "text", defaultValue: user.firstName })
						),
						React.createElement(
							"div",
							{ className: "col-md-6" },
							React.createElement("input", { style: styles.input, type: "text", defaultValue: user.lastName })
						)
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return ManageProfile;
})(Component);

var styles = {
	container: {
		background: "#fff",
		padding: 24,
		border: "1px solid #ddd",
		marginTop: 16
	},
	input: {
		border: "none",
		borderBottom: "1px solid #eee",
		width: 100 + "%",
		marginBottom: 20
	}
};


module.exports = ManageProfile;