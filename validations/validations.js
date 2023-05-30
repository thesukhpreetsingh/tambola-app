const { check } = require("express-validator")
var user = require("../models/userlogin")
var ticket = require("../models/ticket")

var passwordValidator = require('password-validator'); // as isStrongPassword in the package has some issues

var schema = new passwordValidator();
	schema
  		.is().min(5)
  		// .is().max(3)
  		.has().uppercase()
  		.has().lowercase();


exports.signUpValidator =[

	check('username',"Username must be a valid alphanumeric entry with length between 3 to 30").not().isEmpty()
	.isLength({min: 3,max:30})
	.isAlphanumeric()
	/*.withMessage('Username must be alphanumeric')*/ 
	.custom(async uname => {
	    const userCheck = await user.findOne({"username":uname.trim().toLowerCase()});
	    if (userCheck) {
	      throw new Error('Username already in use');
	    }
	 }),

	check("email","Valid Email is required").not().isEmpty()
	.isEmail().normalizeEmail({gmail_remove_dots:true})
	.custom(async mail => {
	    const userCheck = await user.findOne({"email":mail.trim().toLowerCase()});
	    if (userCheck) {
	      throw new Error('Email already in use');
	    }
	 }),

	check("password")
	.not().isEmpty()
	.withMessage("Password must not be empty")
    .custom((password) => {
      // Validate the password using the password schema
      if (!schema.validate(password)) {
        throw new Error(
          "Password must be a valid entry with minimum 5 characters, 1 lowercase, 1 uppercase, and 1 number"
        );
      }
      return true;
    }),
 //    .isStrongPassword({
 //      minLength: 5,
 //      minLowercase: 1,
 //      minUppercase: 1,
 //      minNumbers: 1,
 //    })
	// .withMessage("Password must be a valid entry with minimum 5 characters  with 1 lowercase and 1 Uppercase and 1 number"),
]


exports.loginValidator =[

	check('username',"Username must be a valid alphanumeric entry with length between 3 to 30").not().isEmpty()
	.isLength({min: 3,max:30})
	.isAlphanumeric(),

	check("password")
	.not().isEmpty()
	.withMessage("Password must not be empty")
    .custom((password) => {
      // Validate the password using the password schema
      if (!schema.validate(password)) {
        throw new Error(
          "Password must be a valid entry with minimum 5 characters, 1 lowercase, 1 uppercase, and 1 number"
        );
      }
      return true;
    }),
 //    .isStrongPassword({
 //      minLength: 5,
 //      minLowercase: 1,
 //      minUppercase: 1,
 //      minNumbers: 1,
 //    })
	// .withMessage("Password must be a valid entry with minimum 5 characters  with 1 lowercase and 1 Uppercase and 1 number"),
]

exports.ticketCreationValidation =[

	check('myToken',"Authorization token missing").not().isEmpty(),

	check("knownMeID","knownMeID should be a valid eventIdentifier for this ticket batch with character length between 5 to 30")
	.not().isEmpty()
	.isLength({min: 5,max:30})
	.isAlphanumeric()
	.custom(async theKnownMeID => {
	    const knowMeExists = await ticket.findOne({"knowMeID":theKnownMeID.trim().toLowerCase()});
	    if (knowMeExists) {
	      throw new Error('knownMeID already in use');
	    }
	}),

	check("ticketCount")
	.not().isEmpty()
	.withMessage("This counter must not be empty")
    .isInt({ min: 1 }).withMessage('counter must be a number greater than or equal to 1')
    .custom(value => {
      if (value % 1 !== 0) {
        throw new Error('counter must be an integer (no decimals)');
      }
      return true;
    }),
]
exports.fetchTicketValidation =[

	check('myToken',"Authorization token missing").not().isEmpty(),

	check("knownMeID")
	.optional()
	.isLength({min: 5,max:30})
	.isAlphanumeric()
	.withMessage("knownMeID should be a valid eventIdentifier for this ticket batch with character length between 5 to 30"),

	check("pageSize")
	.optional()
	.isInt({ min: 1 }).withMessage('counter must be a number greater than or equal to 1'),

	check("pagenumber")
	.optional()
	.isInt({ min: 1 }).withMessage('counter must be a number greater than or equal to 1')
]