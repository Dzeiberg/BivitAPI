// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Scotch2')
var classroom = require('./app/models/classroom');
var article = require('./app/models/article');
var user = require('./app/models/user');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
var api = require('./app/API/routes');
app.use('/api', api);




//require('./app/API/general');
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
//exports = module.exports = app;