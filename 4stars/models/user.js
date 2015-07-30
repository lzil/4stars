var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	password: String,
	firstName: String,
	lastName: String,
	email: String,
	stars: Number,
	userType: String,
	students: [String]
})

userSchema.statics.addStars = function(name, numStars, cb) {
	return 'hi';
}

var User = mongoose.model('User', userSchema);
module.exports = User;