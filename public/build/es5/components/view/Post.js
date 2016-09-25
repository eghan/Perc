"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var Post = (function (Component) {
	function Post(props, context) {
		_classCallCheck(this, Post);

		_get(Object.getPrototypeOf(Post.prototype), "constructor", this).call(this, props, context);
		this.state = {};
	}

	_inherits(Post, Component);

	_prototypeProperties(Post, null, {
		viewPost: {
			value: function viewPost(event) {
				event.preventDefault();
				this.props.clickHandler(this.props.post);
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var post = this.props.post;
				var image = "https://media-service.appspot.com/site/images/" + post.image + "?crop=420";
				return React.createElement(
					"div",
					{ id: post.id, style: styles.container, className: "clearfix" },
					React.createElement("img", { className: "hidden-xs", style: styles.postImage, src: image }),
					React.createElement("img", { className: "visible-xs", style: styles.postImageMobile, src: image }),
					React.createElement(
						"div",
						{ style: { padding: 16 } },
						React.createElement(
							"h4",
							{ className: "list-group-item-heading" },
							React.createElement(
								"a",
								{ onClick: this.viewPost.bind(this), style: { color: this.props.color }, href: "/post/" + post.slug },
								post.title
							)
						),
						React.createElement("hr", { style: { marginBottom: 0, marginTop: 12 } }),
						React.createElement(
							"p",
							{ className: "list-group-item-text", style: styles.description },
							post.description
						),
						React.createElement(
							"a",
							{ onClick: this.viewPost.bind(this), style: styles.btnView, href: "/post/" + post.slug, className: "button button-border button-dark button-rounded noleftmargin" },
							"View"
						)
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return Post;
})(Component);

var styles = {
	container: {
		background: "#fff",
		marginTop: 16,
		border: "1px solid #ddd"
	},
	postImage: {
		float: "left",
		width: 180,
		marginRight: 16
	},
	postImageMobile: {
		width: 100 + "%"
	},
	btnView: {
		float: "right",
		marginBottom: 20
	},
	description: {
		marginTop: 6,
		marginBottom: 20
	}
};

module.exports = Post;