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
				res.render('student', {user:req.user, message: req.flash('message')});
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
		console.log(req.body);
		User.findOne({ 'username' : req.body.name }, function(err, usr) {
			if (user.userType === 'teacher') {
				var stars = usr.stars;
				console.log(req.body.stars);
				User.update({username: usr.username}, {stars: stars + req.body.stars, reason: req.body.reason}, function(err, result) {
					if (err) {
						console.log(err);
					}
				});
			}
			res.redirect('/home');
		});
	})

	router.get('/signout', function(req, res) {
		console.log('meh')
		req.logout();
		res.redirect('/');
	});

	return router;
}