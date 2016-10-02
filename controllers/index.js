var PostController = require('../controllers/PostController')
var ProfileController = require('../controllers/ProfileController')
var AccountController = require('../controllers/AccountController')
var ReplyController = require('../controllers/ReplyController')
var TrackController = require('../controllers/TrackController')

module.exports = {
	post: PostController,
	profile: ProfileController,
	account: AccountController,
	reply: ReplyController,
	track: TrackController
}