const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");
var sanitize = require('mongo-sanitize');

var bcrypt          = require('bcryptjs');
const saltRounds = 8;

var User = require("../models/userlogin")


exports.login = async function (req,res) {
	const signUpErrors = validationResult(req);
	if(!signUpErrors.isEmpty()){
		return res.status(400).json({error:true,errors:signUpErrors.array()});
	}

	var username = sanitize(req.body.username.trim())
	var password = req.body.password.trim()

	var theUser = await User.findOne({username:username})

	if (theUser){
		var strpass     = encodeURIComponent(password);
        if(bcrypt.compareSync(strpass, theUser.password)){

			var token = await jwt.sign({
			  data: theUser
			}, process.env.jwtTokenSecret, { expiresIn: '1h' });
        	return res.status(200).json({error:false,message:"Successfully logged in",myToken:token})
          
        }else{
        	return res.status(400).json({"error" : true,"message" : "Password is not correct"});
        }

	}else{
		return res.status(400).json({error:true, message:"User not found"})
	}

	return res.send("Here in login");

}


router.post('/tambolaSignup', async (req, res) => {
	const signUpErrors = validationResult(req);
	if(!signUpErrors.isEmpty()){
		return res.status(400).json({error:true,errors:signUpErrors.array()});
	}
	else{
		var createUser = User()
		createUser.username = sanitize(req.body.username.trim())
		createUser.email = sanitize(req.body.email.trim())

	    var password    = (req.body.password).trim()
	    var strpass     = encodeURIComponent(password);
	    var salt = bcrypt.genSaltSync(saltRounds);
	    var hash = bcrypt.hashSync(strpass, salt);
	    createUser.password  = hash
		var created = await createUser.save()
		if(!created){
			return res.status(400).json({error:true,message:"Unable to register the user"})
		}else{
			return res.status(200).json({error:false,message:"Successfully created the user"})
		}

	}
});



module.exports = {
  login: exports.login,
  router: router
};