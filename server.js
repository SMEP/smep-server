
var express = require('express');
var app = express();

var mongoose = require('mongoose');
//mongoose.set('debug', true);

var port = process.env.PORT || 8080;
var database = require('./config/database');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');
var methodOverride = require('method-override'); // Allow PUT, DELETE, etc

// configuration ===============================================================
mongoose.connect( database.localUrl );

app.use( express.static( __dirname + '/public' ) );
app.use( morgan('dev') ); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// routes ======================================================================
require('./app/routes.js')(app);


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
