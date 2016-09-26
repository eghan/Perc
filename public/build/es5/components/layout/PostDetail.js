"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var _utils = require("../../utils");

var APIManager = _utils.APIManager;
var TextUtils = _utils.TextUtils;
var _view = require("../view");

var Map = _view.Map;
var Post = _view.Post;
var actions = _interopRequire(require("../../actions/actions"));

var store = _interopRequire(require("../../stores/store"));

var connect = require("react-redux").connect;
var PostDetail = (function (Component) {
	function PostDetail(props, context) {
		_classCallCheck(this, PostDetail);

		_get(Object.getPrototypeOf(PostDetail.prototype), "constructor", this).call(this, props, context);
		this.state = {
			markers: []

		};
	}

	_inherits(PostDetail, Component);

	_prototypeProperties(PostDetail, null, {
		componentDidMount: {
			value: function componentDidMount() {
				var post = this.props.posts[this.props.params.slug];
				var postArray = [post];
				this.setState({
					markers: postArray
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var post = this.props.posts[this.props.params.slug];
				var postLocation = {
					lat: post.geo[0],
					lng: post.geo[1]
				};

				var icons = post.images.map(function (icon, i) {
					var url = "https://media-service.appspot.com/site/images/" + icon;
					return React.createElement(
						"div",
						{ key: i, className: "col-md-2" },
						React.createElement(
							"a",
							{ href: url, target: "_blank", className: "left-icon", "data-lightbox": "image" },
							React.createElement("img", { style: { marginTop: 12 }, src: url + "?crop=420" })
						)
					);
				});

				var imageUrl = "https://media-service.appspot.com/site/images/" + post.image;

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
								center: postLocation,
								onCenterChanged: this.mapMoved, markers: this.state.markers })
						)
					),
					React.createElement(
						"section",
						{ id: "content" },
						React.createElement(
							"div",
							{ className: "content-wrap container clearfix" },
							React.createElement(
								"div",
								{ style: styles.container },
								React.createElement(
									"h2",
									null,
									post.title
								),
								React.createElement("hr", null),
								React.createElement(
									"div",
									{ className: "row" },
									React.createElement(
										"div",
										{ className: "col-md-8" },
										React.createElement("p", { dangerouslySetInnerHTML: { __html: TextUtils.convertToHtml(post.description) } }),
										React.createElement(
											"div",
											{ className: "row" },
											icons
										)
									),
									React.createElement(
										"div",
										{ className: "col-md-4" },
										React.createElement(
											"a",
											{ href: imageUrl, target: "_blank", className: "left-icon", "data-lightbox": "image" },
											React.createElement("img", { style: styles.postImage, src: imageUrl + "?crop=420" })
										)
									)
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

	return PostDetail;
})(Component);

var styles = {
	container: {
		background: "#fff",
		padding: 24,
		border: "1px solid #ddd",
		marginTop: 16
	},
	postImage: {
		width: 100 + "%",
		marginTop: 12,
		border: "1px solid #ddd",
		padding: 8
	},
	description: {
		minHeight: 220
	}
};

var stateToProps = function (state) {
	return {
		posts: state.postReducer.posts
	};
};

module.exports = connect(stateToProps)(PostDetail);