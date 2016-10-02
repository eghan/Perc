var express = require('express')
var router = express.Router()
var Track = require('../models/Track')
var Promise = require('bluebird')

function fetchTracks(){
	return new Promise(function(resolve, reject){
		Track.find(null, function(err, results){
			if (err){
				reject(err)
				return
			}

			resolve(results)
		})
	})
}

// function updateTrack(track, params){
// 	return new Promise(function(resolve, reject){
// 		track.update(params, function(err, track){
// 			if (err){
// 				reject(err)
// 				return
// 			}

// 			resolve(track)
// 		})
// 	})
// }

router.get('/', function(req, res, next){

	Track.create({}, function(err, track){
		if (err){
			res.json({
				confirmation: 'fail',
				message: err
			})
			return
		}

		res.json({
			confirmation: 'success',
			result: track.summary()
		})
	})

})


router.post('/', function(req, res, next){

	console.log('TRACK REQUEST: '+JSON.stringify(req.body))

	var path = req.body.path

	fetchTracks()
	.then(function(tracks){
		var track = tracks[0]
		var pageMap = track.pageMap
		var count = (pageMap[path]==null) ? 0 : pageMap[path]
		pageMap[path] = count+1
		track['pageMap'] = pageMap
		track.markModified('pageMap')

		track.save(function(err){

			res.json({
				confirmation: 'success',
				result: track.summary()
			})

			return
		})

	})
	.catch(function(err){
		res.json({
			confirmation: 'fail',
			message: err
		})
	})

})


module.exports = router