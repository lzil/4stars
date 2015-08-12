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
				for (var i = 0; i < usr.students.length; i++) {
					User.findOne({ 'username' : usr.students[i]}, function(err, student) {
						students.push(student);
						console.log(students)
						if (students.length == usr.students.length - 1) {
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

	router.get('/assignStars', isAuthenticated, function(req, res) {
		var user = req.user;
		User.findOne({ 'username' : user.username }, function(err, usr) {
			if (usr.userType === 'teacher') {
				var stars = usr.stars;
				User.update({username: usr.username}, {stars: stars + 4}, function(err, result) {
					if (err) {
						console.log(err);
					}
				});
			}
			res.render('teacher', {user:req.user});
		});
	})

	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}