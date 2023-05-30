var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var userLogins = require("../models/userlogin")
var userController = require("../controllers/userController")

var validator = require("../validations/validations")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tambola App' });
});


router.post("/tambolaLogin",validator.loginValidator,userController.login)
router.post("/tambolaSignup",validator.signUpValidator,userController.router)
module.exports = router;
