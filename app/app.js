var compress = require('compression');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var express = require("express");
var morgan = require('morgan');
var __ = require("underscore");


var app = express();
app.use(morgan('tiny'));
app.use(compress());
app.use(cookieParser());
app.use(cookieSession({
  secret: process.env.COOKIE_SECRET
}));


app.use(express.static(__dirname + '/../public'));

app.get('/api/foo', function(req, res) {
  res.status(200).send('bar');
});


var port = process.env.PORT || 5000;
var server = require('http').Server(app);
server.listen(port, function() {
  console.log("Listening on " + port);
});




