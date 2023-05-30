var mongoose	=   require("mongoose");
// var bcrypt 		= require('bcrypt-nodejs');
var bcrypt 		= require("bcryptjs")

var Schema          = mongoose.Schema;
// create schema
var userLoginSchema  = Schema({
	"username" 	: {type : String, required:true},
	"email"		: {type : String, required:true},
	"password" 	: {type : String, required:true},
},
	{
		"timestamps": true ,
	});

userLoginSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userLoginSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('userlogins',userLoginSchema);