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
var DateUtils = _utils.DateUtils;
var _view = require("../view");

var Map = _view.Map;
var Post = _view.Post;
var ManageNotifications = require("../containers").ManageNotifications;
var actions = _interopRequire(require("../../actions/actions"));

var store = _interopRequire(require("../../stores/store"));

var connect = require("react-redux").connect;
var styles = _interopRequire(require("../layout/Style"));

var PostDetail = (function (Component) {
	function PostDetail(props, context) {
		_classCallCheck(this, PostDetail);

		_get(Object.getPrototypeOf(PostDetail.prototype), "constructor", this).call(this, props, context);
		this.state = {
			showModal: false,
			markers: [],
			showManageNotifications: false,
			reply: {
				message: ""
			}
		};
	}

	_inherits(PostDetail, Component);

	_prototypeProperties(PostDetail, null, {
		componentDidMount: {
			value: function componentDidMount() {
				window.scrollTo(0, 0);

				var post = this.props.posts[this.props.params.slug];
				var postArray = [post];
				this.setState({
					markers: postArray
				});
			},
			writable: true,
			configurable: true
		},
		submitReply: {
			value: function submitReply(event) {
				event.preventDefault();
				var reply = Object.assign({}, this.state.reply);

				var user = this.props.currentUser;
				if (user != null) {
					reply.profile = {
						id: user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email
					};
				}

				var post = this.props.posts[this.props.params.slug];
				reply.recipient = {
					id: post.profile.id,
					firstName: post.profile.firstName,
					lastName: post.profile.lastName,
					email: post.contact
				};

				reply.subject = post.title;

				APIManager.handlePost("/api/reply", reply, function (err, result) {
					if (err) {
						alert(err);
						return;
					}

					console.log("submitReply:" + JSON.stringify(result));
					alert("Notification Sent");
				});
			},
			writable: true,
			configurable: true
		},
		updateReply: {
			value: function updateReply(event) {
				//		console.log('updateReply:'+event.target.value)
				var updatedReply = Object.assign({}, this.state.reply);
				updatedReply.message = event.target.value;
				this.setState({
					reply: updatedReply
				});
			},
			writable: true,
			configurable: true
		},
		toggleManageNotifications: {
			value: function toggleManageNotifications(event) {
				event.preventDefault();
				this.setState({
					showManageNotifications: !this.state.showManageNotifications
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

				var notifcations = null;
				if (this.state.showManageNotifications) {
					notifcations = React.createElement(ManageNotifications, { user: this.props.currentUser });
				} else {
					notifcations = React.createElement(
						"div",
						{ style: styles.container },
						React.createElement(
							"h2",
							null,
							"Notifications"
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
									{ className: "nobottommargin" },
									"Never Lose an Apartment"
								),
								React.createElement(
									"p",
									{ style: { marginTop: 6 } },
									"The apartment search in large cities like New York is extremely competitive. Often, an apartment is rented merely hours after it is posted on a search board simply because someone else got to it first. On Perc, you can hear about apartments before anyone else by signing up for notifications."
								),
								React.createElement(
									"a",
									{ onClick: this.toggleManageNotifications.bind(this), href: "#", className: "button button-border button-dark button-rounded noleftmargin" },
									"Set Up Notifications"
								)
							),
							React.createElement(
								"div",
								{ className: "col-md-6" },
								React.createElement(
									"h4",
									{ className: "nobottommargin" },
									"How it Works"
								),
								React.createElement(
									"ol",
									{ style: { padding: 16, paddingLeft: 32, fontWeight: 200, background: "#f9f9f9", marginTop: 6 } },
									React.createElement(
										"li",
										null,
										"Specify the apartments you want to know about according to price and location."
									),
									React.createElement(
										"li",
										null,
										"Purchase notifications."
									),
									React.createElement(
										"li",
										null,
										"When a new apartment in your specified price and location is posted, you will receive notifications via email and text."
									)
								)
							)
						)
					);
				}

				return React.createElement(
					"div",
					{ className: "clearfix" },
					React.createElement(
						"header",
						{ id: "header", className: "no-sticky" },
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
									"span",
									{ style: { float: "right", fontWeight: 800, fontSize: 20 } },
									"$",
									post.price
								),
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
								),
								React.createElement("hr", null),
								React.createElement(
									"div",
									{ className: "row" },
									React.createElement(
										"div",
										{ className: "col-md-12" },
										React.createElement("textarea", { onChange: this.updateReply.bind(this), style: styles.reply, placeholder: "Reply. Include contact info." }),
										React.createElement(
											"a",
											{ onClick: this.submitReply.bind(this), href: "#", className: "button button-border button-dark button-rounded noleftmargin" },
											"Submit"
										)
									)
								)
							),
							notifcations
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

var stateToProps = function (state) {
	return {
		posts: state.postReducer.posts,
		currentUser: state.accountReducer.currentUser
	};
};

module.exports = connect(stateToProps)(PostDetail);