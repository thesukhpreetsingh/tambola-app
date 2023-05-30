var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var userLogins = require("../models/userlogin")
var ticketsController = require("../controllers/ticketsController")
var ticket = require("../models/ticket")

var validator = require("../validations/validations")

/* GET users listing. */
router.post('/create', validator.ticketCreationValidation ,isAuthorized ,ticketsController.create);
router.post("/fetchtickets",validator.fetchTicketValidation,isAuthorized,ticketsController.router)


async function isAuthorized(req,res, next){
	try{
		var token = req.body.myToken;
		var decoded = await jwt.verify(token, process.env.jwtTokenSecret);
		next()


	}catch(error){
		return res.status(400).json({error:true,message:"Session expired. Please relogin"})

	}

}

module.exports = router;
