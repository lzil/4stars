var express = require('express');
var router = express.Router();
var User = require('../models/user');

var isAuthenticated = function(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function(passport) {
	router.get('/', function(req, res) {
		res.render('index', {message: req.flash('message')});
	});

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	}));

	router.get('/home', isAuthenticated, function(req, res) {
		var user = req.user;
		User.findOne({ 'username' : user.username }, function(err, usr) {
			if (usr.userType === 'teacher') {
				var students = [];
				if (usr.students.length == 0) {
					res.render('teacher', {user:req.user, students: students, message: req.flash('message')});
				}
				for (var i = 0; i < usr.students.length; i++) {
					User.findOne({ 'username' : usr.students[i]}, function(err, student) {
						students.push(student);
						if (students.length == usr.students.length) {
							res.render('teacher', {user:req.user, students: students, message: req.flash('message')});
						}
					})
				}
			} else {
				var prizes = [{name: 'teddy bear', src: '/images/teddybear.jpg', price: 30}, {name: 'notebook', src: '/images/notebooks.jpg', price: 15}, {name:'superman cape for a day', src: '/images/superman.jpg', price:10}, {name:'candy', src:'/images/candies.jpg', price:12}, {name: '15 min extra recess', src:'/images/recess.jpg', price:5}, {name:'colored pencils', src:'/images/color_pencils.jpg', price:20}, {name:'30 mins computer time', src:'/images/computer.jpg', price:15}, {name:'movie', src:'/images/movie.jpg', price:20}];
				var buckets = [];
				var bucket = []
				for (var i = 0; i < prizes.length; i++) {
					bucket.push(prizes[i]);
					if (i % 4 === 3) {
						buckets.push(bucket);
						bucket = [];
					}
				}
				if (bucket.length > 0) {
					buckets.push(bucket);
				}
				res.render('student', {user:req.user, prizes:buckets, message: req.flash('message')});
			}
		});
	})

	router.get('/about', function(req, res) {
		res.render('about');
	})

	router.get('/shop', isAuthenticated, function(req, res) {
		var user = req.user;
		User.findOne({ 'username' : user.username }, function(err, usr) {
			if (usr.userType === 'student') {
				res.render('shop', {message: req.flash('message')})
			} else {
				res.render('teacher', {user:req.user, message: req.flash('message')});
			}
		});
	})

	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/home',
		failureFlash : true
	}));

	router.post('/createStudent', passport.authenticate('createStudent', {
		successRedirect: '/home',
		failureRedirect: '/home',
		failureFlash: true
	}));

	router.post('/assignStars', isAuthenticated, function(req, res) {
		var user = req.user;
		User.findOne({ 'username' : req.body.name }, function(err, usr) {
			if (user.userType === 'teacher') {
				var stars = usr.stars;
				User.update({username: usr.username}, {$inc: {stars: req.body.stars}, reason: req.body.reason}, function(err, result) {
					if (err) {
						console.log(err);
					}
				});
			}
			res.redirect('/home');
		});
	})

	router.post('/redeem', isAuthenticated, function(req, res) {
		user = req.user;
		User.findOne({ 'username' : user.username }, function(err, usr) {
			var stars = usr.stars;
			User.update({username: usr.username}, {stars: stars - req.body.price}, function(err, result) {
				if (err) {
					console.log(err);
				}
			});
			//res.redirect('/home');
		});
	})

	router.get('/signout', function(req, res) {
		console.log('meh')
		req.logout();
		res.redirect('/');
	});

	router.get('/refreshthepage', function(req, res) {
		res.redirect('/home');
	})

	return router;
}