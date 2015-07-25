var models = require('../models');
var bluebird = require('bluebird');



module.exports = {
  messages: {
    get: function (req, res) {
    	// on data we check the request body and get message key out of object
    	// console.log('req', req.body);
    	models.messages.get(req, res);

    }, // a function which handles a get request for all messages
    post: function (req, res) {
    	// console.log('req', req);
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {},
    post: function (req, res) {}
  }
};


