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


//From Tutorial
var passport = require('passport');
var flash 	 = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api


//From tutorial
// set up our express application
require('./app/config/passport')(passport); // pass passport for configuration
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/API/routes')(app, passport);
//require('./app/API/general');
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
//exports = module.exports = app;