"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _react = require("react");

var React = _interopRequire(_react);

var Component = _react.Component;
var Dropzone = _interopRequire(require("react-dropzone"));

var APIManager = require("../../utils").APIManager;
var Loader = _interopRequire(require("react-loader"));

var actions = _interopRequire(require("../../actions/actions"));

var store = _interopRequire(require("../../stores/store"));

var browserHistory = require("react-router").browserHistory;
var styles = _interopRequire(require("../containers/Style"));

var CreatePost = (function (Component) {
	function CreatePost(props, context) {
		_classCallCheck(this, CreatePost);

		_get(Object.getPrototypeOf(CreatePost.prototype), "constructor", this).call(this, props, context);
		this.uploadImage = this.uploadImage.bind(this);
		this.state = {
			showLoader: false,
			post: {
				title: "",
				address: "",
				city: "new york",
				state: "ny",
				description: "",
				type: "rental",
				price: "",
				image: "",
				images: [] }
		};
	}

	_inherits(CreatePost, Component);

	_prototypeProperties(CreatePost, null, {
		updatePost: {
			value: function updatePost(event) {
				var value = event.target.value;
				//		console.log('updatePost: '+value)

				var updatedPost = Object.assign({}, this.state.post);
				if (event.target.id == "location") {
					var parts = value.split(",");
					updatedPost.city = parts[0].toLowerCase().trim();
					updatedPost.state = parts[1].toLowerCase().trim();
				} else {
					updatedPost[event.target.id] = value;
				}

				this.setState({
					post: updatedPost
				});
			},
			writable: true,
			configurable: true
		},
		submitPost: {
			value: function submitPost(event) {
				event.preventDefault();
				console.log("submitPost: " + JSON.stringify(this.state.post));
				var post = Object.assign({}, this.state.post);
				var user = this.props.user;
				post.profile = {
					id: user.id,
					name: user.firstName,
					email: user.email
				};

				APIManager.handlePost("/api/post", post, function (err, response) {
					if (err) {
						alert(err);
						return;
					}

					console.log(JSON.stringify(response));
					var post = response.result;
					store.currentStore().dispatch(actions.postsReceived([post]));
					browserHistory.push("/post/" + post.slug);
				});
			},
			writable: true,
			configurable: true
		},
		uploadPrimaryImage: {
			value: function uploadPrimaryImage(files) {
				this.uploadImage(files, "primary");
			},
			writable: true,
			configurable: true
		},
		uploadSecondaryImage: {
			value: function uploadSecondaryImage(files) {
				this.uploadImage(files, "secondary");
			},
			writable: true,
			configurable: true
		},
		uploadImage: {
			value: function uploadImage(files, type) {
				var _this = this;
				this.setState({ showLoader: true });

				APIManager.upload(files[0], function (err, response) {
					_this.setState({
						showLoader: false
					});

					if (err) {
						alert(response.message);
						return;
					}

					//			console.log('UPLOAD IMAGE: '+JSON.stringify(response))

					var updatedPost = Object.assign({}, _this.state.post);
					if (type == "primary") updatedPost.image = response.id;else {
						var images = Object.assign([], updatedPost.images);
						images.push(response.id);
						updatedPost.images = images;
					}

					_this.setState({
						post: updatedPost
					});
				});
			},
			writable: true,
			configurable: true
		},
		render: {
			value: function render() {
				var user = this.props.user;
				var post = this.state.post;
				var primaryImage = post.image.length == 0 ? null : React.createElement("img", { style: { width: 96, marginRight: 12, marginTop: 12 }, src: "https://media-service.appspot.com/site/images/" + post.image + "?crop=260" });
				var secondaryImages = post.images.map(function (image, i) {
					return React.createElement("img", { style: styles.icon, src: "https://media-service.appspot.com/site/images/" + image + "?crop=260" });
				});

				return React.createElement(
					"div",
					{ style: styles.container },
					React.createElement(Loader, { options: styles.loader, className: "loader", loaded: !this.state.showLoader, loadedClassName: "loadedContent" }),
					React.createElement(
						"h2",
						null,
						"Create Listing"
					),
					React.createElement(
						"div",
						{ className: "row" },
						React.createElement(
							"div",
							{ className: "col-md-6" },
							React.createElement("input", { id: "title", onChange: this.updatePost.bind(this), style: styles.input, type: "text", placeholder: "Title", defaultValue: post.title }),
							React.createElement("input", { id: "contact", onChange: this.updatePost.bind(this), style: styles.input, type: "text", placeholder: "Email", defaultValue: post.contact }),
							React.createElement("input", { id: "price", onChange: this.updatePost.bind(this), style: styles.input, type: "text", placeholder: "Price (USD)", defaultValue: post.contact })
						),
						React.createElement(
							"div",
							{ className: "col-md-6" },
							React.createElement("input", { id: "address", onChange: this.updatePost.bind(this), style: styles.input, type: "text", placeholder: "Address", defaultValue: post.address }),
							React.createElement(
								"select",
								{ id: "location", onChange: this.updatePost.bind(this), style: styles.select },
								React.createElement(
									"option",
									{ value: "new york, ny" },
									"New York, NY"
								),
								React.createElement(
									"option",
									{ value: "los angeles, ca" },
									"Los Angeles, CA"
								),
								React.createElement(
									"option",
									{ value: "san francisco, ca" },
									"San Francisco, CA"
								)
							),
							React.createElement(
								"select",
								{ id: "type", onChange: this.updatePost.bind(this), style: styles.select },
								React.createElement(
									"option",
									{ value: "rental" },
									"Apartment For Rent"
								),
								React.createElement(
									"option",
									{ value: "job" },
									"Help Wanted"
								)
							)
						),
						React.createElement(
							"div",
							{ className: "col-md-12" },
							React.createElement("textarea", { id: "description", onChange: this.updatePost.bind(this), style: styles.description, placeholder: "Description", defaultValue: post.description }),
							React.createElement(
								"div",
								{ className: "row" },
								React.createElement(
									"div",
									{ className: "col-md-4" },
									React.createElement(
										Dropzone,
										{ style: styles.upload, onDrop: this.uploadPrimaryImage.bind(this) },
										"Upload Primary Image Here",
										React.createElement("br", null),
										primaryImage
									)
								),
								React.createElement(
									"div",
									{ className: "col-md-8" },
									React.createElement(
										Dropzone,
										{ style: styles.upload, onDrop: this.uploadSecondaryImage.bind(this) },
										"Upload Secondary Images Here (Limit 4)",
										React.createElement("br", null),
										secondaryImages
									)
								)
							),
							React.createElement(
								"a",
								{ onClick: this.submitPost.bind(this), style: styles.btnNext, href: "#", className: "button button-border button-dark button-rounded noleftmargin" },
								"Create Post"
							)
						)
					)
				);
			},
			writable: true,
			configurable: true
		}
	});

	return CreatePost;
})(Component);

module.exports = CreatePost;