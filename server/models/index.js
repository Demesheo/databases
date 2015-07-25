var db = require('../db');




module.exports = {
	messages: {
		get: function (req, res) {
    	//get the data from the database

    	console.log('inside model');
    	console.log('req', req.body);
    	console.log('res', res.body);

    	db.dbConnection.query('SELECT * from Messages', function(err, rows, fields) {
    		if (!err)
    			console.log('The GET: ', rows);
    		else
    			console.log('Error while performing Query.');
    	});



    }, // a function which produces all the messages

    post: function (data, cb) {

    	db.dbConnection.query('INSERT INTO Messages ("Message Text") VALUES ("'+data+'")', function(err, rows, fields) {
    		if (!err){
    			console.log('The POST ', rows);
    			cb();	
    		} else {
    			console.log('Error while performing Query.', err);
    		}
    		}
    	);
    } // a function which can be used to insert a message into the database
},

users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
}
};

