var db = require('../db');




module.exports = {
  messages: {
    get: function () {
    	//get the data from the database
    	console.log('inside model');
    	db.

    }, // a function which produces all the messages

    post: function (req, res) {

    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

