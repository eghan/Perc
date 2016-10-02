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
var _view = require("../view");

var Map = _view.Map;
var Post = _view.Post;
var Login = _view.Login;
var actions = _interopRequire(require("../../actions/actions"));

var store = _interopRequire(require("../../stores/store"));

var connect = require("react-redux").connect;
var browserHistory = require("react-router").browserHistory;
var Posts = (function (Component) {
	function Posts(props, context) {
		_classCallCheck(this, Posts);

		_get(Object.getPrototypeOf(Posts.prototype), "constructor", this).call(this, props, context);
		this.toggleLogin = this.toggleLogin.bind(this);
		this.fetchPosts = this.fetchPosts.bind(this);
		this.state = {};
	}

	_inherits(Posts, Component);

	_prototypeProperties(Posts, null, {
		componentDidMount: {
			value: function componentDidMount() {
				if (this.props.user != null) {
					if (this.props.userPosts.length == 0) this.fetchPosts({ "profile.id": this.props.user.id });
					return;
				}

				// home page, always re-query
				this.fetchPosts(this.props.location);
			},
			writable: true,
			configurable: true
		},
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
		fetchPosts: {
			value: function fetchPosts(params) {
				var _this = this;
				APIManager.handleGet("/api/post", params, function (err, response) {
					if (err) {
						alert("ERROR: " + err.message);
						return;
					}

					if (_this.props.user != null) {
						store.currentStore().dispatch(actions.userPostsReceived(response.results));
					}

					if (_this.props.location != null) {
						store.currentStore().dispatch(actions.postsReceived(response.results));
					}
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var _this = this;
				var posts = this.props.user == null ? this.props.posts : this.props.userPosts;

				var currentPosts = posts.map(function (post, i) {
					var textColor = _this.props.selected == post ? "red" : "#000";
					return React.createElement(Post, { key: post.id, post: post, color: textColor });
				});

				return React.createElement(
					"div",
					{ className: "content-wrap container clearfix" },
					currentPosts
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Posts;
})(Component);




var stateToProps = function (state) {
	return {
		userPosts: state.accountReducer.posts,
		posts: state.postReducer.postsArray
	};
};

module.exports = connect(stateToProps)(Posts);