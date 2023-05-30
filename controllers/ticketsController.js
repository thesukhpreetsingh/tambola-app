const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");
var sanitize = require('mongo-sanitize');
var User = require("../models/ticket")
var theTicket = require("../models/ticket")

exports.create = async function (req,res) {
	const ticketCreationErrors = validationResult(req);
	if(!ticketCreationErrors.isEmpty()){
		console.log("ticketCreationErrors.array()",ticketCreationErrors.array())
		return res.status(400).json({error:true,errors:ticketCreationErrors.array()});
	}
    const ticketCount = parseInt(req.body.ticketCount.trim().toLowerCase()); // Dynamic number of tickets
    console.log("ticketCount",ticketCount)
    var knownMeID =req.body.knownMeID.trim().toLowerCase()
    generateAndSaveTambolaTickets(ticketCount,knownMeID)
	return res.status(200).json({error:false,message:"Tickets creation of this batch in progress"})

}
router.post('/fetchtickets', async (req, res) => {
	const ticketCreationErrors = validationResult(req);
	if(!ticketCreationErrors.isEmpty()){
		return res.status(400).json({error:true,errors:ticketCreationErrors.array()});
	}
	var searchFilter={}

	var pageSize = 10; // Number of tickets to fetch
    if(!req.query.pageSize || req.query.pageSize==null || req.query.pageSize==undefined || isNaN(parseInt(req.query.pageSize))){
    		pageSize=10
    }else{
    	pageSize = parseInt(req.query.pageSize)
    }
    if(!req.query.pagenumber || req.query.pagenumber==null || req.query.pagenumber==undefined){
    		skipCount = 0
    }else{
    	skipCount = 5*(req.query.pagenumber-1)
    }
    if(req.body.knownMeID && req.body.knownMeID!==null || req.body.knownMeID!==undefined){
    		searchFilter.knowMeID = req.body.knownMeID
    }
console.log("searchFilter",searchFilter)
console.log("pageSize",pageSize)
console.log("skipCount",skipCount)

	var tickets = await theTicket.find(searchFilter).skip(skipCount).limit(pageSize)
	if(!tickets){
		return res.status(400).json({error:true,message:"No Tickets found"})
	}else{
		return res.status(200).json({error:false,message:"Successr",tickets:tickets})
	}

});



module.exports = {
  create: exports.create,
  router: router
};

// Ticket reation code

// Function to generate and save Tambola tickets
async function generateAndSaveTambolaTickets(ticketCount, knownMeID) {
  const tambolaSets = createTambolaSets(ticketCount);

  for (const tickets of tambolaSets) {
    for (const ticket of tickets) {
      const formattedTicket = ticket.map(column => column.map(number => number === 'x' ? 'x-' : number.toString()));
      // console.log("formattedTicket", formattedTicket);
      const convertedArray = formattedTicket.reduce((result, row) => {
        row.forEach((element, index) => {
          if (!result[index]) {
            result[index] = [];
          }
          result[index].push(element.toString());
        });
        return result;
      }, []);
      const replacedArray = convertedArray.map((subarray) => {
        const indices = [];
        while (indices.length < 4) {
          const index = Math.floor(Math.random() * subarray.length);
          if (!indices.includes(index)) {
            indices.push(index);
            subarray[index] = '00';
          }
        }
        // console.log("subarray",subarray)
        return subarray;
      });
// console.log("replacedArray",replacedArray)
// return
        const tambolaTicket = new theTicket();
        tambolaTicket.ticket = replacedArray;
        tambolaTicket.knowMeID = knownMeID;
        await tambolaTicket.save();

    }
  }

  console.log('Tambola tickets saved successfully!');
}


// Function to create multiple sets of Tambola tickets
function createTambolaSets(ticketCount) {
  const sets = [];

  let remainingTickets = ticketCount;
  while (remainingTickets > 0) {
    const tickets = [];
    const setTicketCount = Math.min(remainingTickets, 6);

    for (let j = 0; j < setTicketCount; j++) {
      const ticket = createTambolaTicket();
      fillBlankSpaces(ticket);
      tickets.push(ticket);
    }

    sets.push(tickets);
    remainingTickets -= setTicketCount;
  }

  return sets;
}


// Function to create a Tambola ticket
function createTambolaTicket() {
  const ticket = [];

  // Generate random unique numbers for each column of the ticket
  for (let col = 0; col < 9; col++) {
    const column = [];

    // Generate unique numbers for each row of the column
    for (let row = 0; row < 3; row++) {
      const number = getRandomNumber(col * 10 + 1, (col + 1) * 10);

      column.push(number);
    }

    // Sort the column in ascending order
    column.sort((a, b) => a - b);

    ticket.push(column);
  }

  return ticket;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fillBlankSpaces(ticket) {
  for (const column of ticket) {
    while (column.length < 3) {
      column.push('x'); // Fill with 'x' for blank spaces
    }
  }
}