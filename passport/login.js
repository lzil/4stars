var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
	passport.use('login', new localStrategy({
		passReqToCallback : true
	},
	function(req, username, password, done) {
		User.findOne({'username' : username},
			function(err, user) {
				if (err)
					return done(err);
				if (!user) {
					console.log('User Not Found with username ' + username);
					return done(null, false, req.flash('message', 'User not found.'));
				}
				if (!isValidPassword(user, password)) {
					console.log('Invalid password');
					return done(null, false, req.flash('message', 'Invalid password'));
				}
				return done(null, user);
			}
		)
	}));

	var isValidPassword = function(user, password) {
		return bCrypt.compareSync(password, user.password);
	}
}