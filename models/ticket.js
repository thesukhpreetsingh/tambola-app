var mongoose	=   require("mongoose");
var Schema          = mongoose.Schema;
// create schema
var ticketSchema  = Schema({
	"ticket" 	: [[String]],
	"knowMeID"		: {type : String, required:true},
	},
	{
		"timestamps": true ,
	});
module.exports = mongoose.model('tickets',ticketSchema);