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

	router.get('/home', function(req, res) {
		var user = req.user;
		User.findOne({ 'username' : user.username }, function(err, usr) {
			if (usr.userType === 'teacher') {
				res.render('teacher', {user:req.user});
			} else {
				res.render('student', {user:req.user});
			}
		});
	})

	router.get('/signup', function(req, res) {
		res.render('register', {message: req.flash('message')});
	});

	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/teacher',
		failureRedirect: '/signup',
		failureFlash : true
	}));

	router.post('/createStudent', passport.authenticate('createStudent', {
		successRedirect: '/teacher',
		failureRedirect: '/teacher',
		failureFlash: true
	}));

	router.get('/teacher', isAuthenticated, function(req, res) {
		var user = req.user;
		User.findOne({ 'username' : user.username }, function(err, usr) {
			if (usr.userType === 'teacher') {
				res.render('teacher', {user:req.user});
			} else {
				res.render('student', {user:req.user});
			}
		});
	});

	router.get('/student', isAuthenticated, function(req, res) {
		var user = req.user;
		User.findOne({ 'username' : user.username }, function(err, usr) {
			if (usr.userType === 'teacher') {
				res.render('teacher', {user:req.user});
			} else {
				res.render('student', {user:req.user});
			}
		});
	});

	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}