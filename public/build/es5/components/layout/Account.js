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
var _containers = require("../containers");

var Nav = _containers.Nav;
var ManageProfile = _containers.ManageProfile;
var Posts = _containers.Posts;
var CreatePost = _containers.CreatePost;
var actions = _interopRequire(require("../../actions/actions"));

var store = _interopRequire(require("../../stores/store"));

var connect = require("react-redux").connect;
var Account = (function (Component) {
	function Account(props, context) {
		_classCallCheck(this, Account);

		_get(Object.getPrototypeOf(Account.prototype), "constructor", this).call(this, props, context);
		this.state = {
			selected: 0,
			menuItems: [{ name: "Profile", component: ManageProfile }, { name: "Listings", component: Posts }, { name: "Submit Listing", component: CreatePost }]
		};
	}

	_inherits(Account, Component);

	_prototypeProperties(Account, null, {
		selectItem: {
			value: function selectItem(index, event) {
				event.preventDefault();

				var item = this.state.menuItems;
				this.setState({
					selected: index
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var _this = this;
				var user = this.props.currentUser;

				var sideMenu = this.state.menuItems.map(function (item, i) {
					var style = i == _this.state.selected ? styles.selected : styles.menuItem;
					return React.createElement(
						"li",
						{ key: i },
						React.createElement(
							"div",
							{ style: style },
							React.createElement(
								"a",
								{ onClick: _this.selectItem.bind(_this, i), href: "#" },
								React.createElement(
									"div",
									null,
									item.name
								)
							)
						)
					);
				});

				var selected = this.state.menuItems[this.state.selected];

				return React.createElement(
					"div",
					{ className: "clearfix" },
					React.createElement(
						"header",
						{ id: "header", className: "no-sticky", style: { marginTop: 64 } },
						React.createElement(
							"div",
							{ id: "header-wrap" },
							React.createElement(
								"div",
								{ className: "container clearfix" },
								React.createElement(
									"nav",
									{ id: "primary-menu", style: { paddingTop: 96 } },
									React.createElement(
										"ul",
										null,
										sideMenu
									)
								)
							)
						)
					),
					React.createElement(
						"section",
						{ id: "content" },
						React.createElement(
							"div",
							{ className: "content-wrap container clearfix" },
							React.createElement(selected.component, { user: user })
						)
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Account;
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
	},
	selected: {
		padding: 8,
		background: "#f9f9f9",
		borderRadius: 2
	},
	menuItem: {
		padding: 8,
		background: "#fff"
	}
};

var stateToProps = function (state) {
	return {
		currentUser: state.accountReducer.currentUser

	};
};

module.exports = connect(stateToProps)(Account);