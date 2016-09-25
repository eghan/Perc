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
var _containers = require("../containers");

var Nav = _containers.Nav;
var Posts = _containers.Posts;
var actions = _interopRequire(require("../../actions/actions"));

var store = _interopRequire(require("../../stores/store"));

var connect = require("react-redux").connect;
var Home = (function (Component) {
	function Home(props, context) {
		_classCallCheck(this, Home);

		_get(Object.getPrototypeOf(Home.prototype), "constructor", this).call(this, props, context);
		this.fetchPosts = this.fetchPosts.bind(this);
		this.selectPost = this.selectPost.bind(this);
		this.calculateDistance = this.calculateDistance.bind(this);
		this.mapMoved = this.mapMoved.bind(this);
		this.state = {
			showLogin: false,
			selected: null,
			currentLocation: {
				lat: 40.7575285, lng: -73.9884469
			}
		};
	}

	_inherits(Home, Component);

	_prototypeProperties(Home, null, {
		selectPost: {
			value: function selectPost(post) {
				$("html, body").animate({
					scrollTop: $("#" + post.id).offset().top - 200
				}, 750);

				this.setState({
					selected: post
				});
			},
			writable: true,
			configurable: true
		},
		calculateDistance: {
			value: function calculateDistance(location) {
				var currentLocation = this.state.currentLocation;
				var deltaX = currentLocation.lat - location.lat;
				var deltaY = currentLocation.lng - location.lng;
				var cSquared = deltaY * deltaY + deltaX * deltaX;
				var dist = Math.sqrt(cSquared);
				return dist;
			},
			writable: true,
			configurable: true
		},
		mapMoved: {
			value: function mapMoved(location) {
				var dist = this.calculateDistance(location);
				console.log("MAP MOVED: " + dist);
				if (dist < 0.02) {
					return;
				}this.fetchPosts(location);
			},
			writable: true,
			configurable: true
		},
		fetchPosts: {
			value: function fetchPosts(location) {
				this.setState({
					currentLocation: location
				});

				APIManager.handleGet("/api/post", location, function (err, response) {
					if (err) {
						alert(err.message);
						return;
					}

					store.currentStore().dispatch(actions.postsReceived(response.results));
				});
			},
			writable: true,
			configurable: true
		},
		viewPost: {
			value: function viewPost(post) {
				console.log("ViewPost: " + JSON.stringify(post));
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				return React.createElement(
					"div",
					{ className: "clearfix" },
					React.createElement(
						"header",
						{ id: "header", className: "no-sticky", style: { marginTop: 64 } },
						React.createElement(
							"div",
							{ id: "header-wrap" },
							React.createElement(Map, {
								center: this.state.currentLocation,
								onCenterChanged: this.mapMoved,
								selectPost: this.selectPost,
								markers: this.props.posts })
						)
					),
					React.createElement(
						"section",
						{ id: "content" },
						React.createElement(Posts, { selected: this.state.selected })
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Home;
})(Component);




var stateToProps = function (state) {
	return {
		posts: state.postReducer.postsArray
	};
};

module.exports = connect(stateToProps)(Home);