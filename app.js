var express = require('express');
var app = express();
var router = express.Router();
var viewsPath = __dirname + '/views/';
var fs = require('fs')
var tools = require('./tools.js')();

app.use(express.static('public'))
app.use(express.static('libraries'))


router.use(function(req, res, next){
	console.log('/' + req.method);
	next();
});

router.get('/', function(req, res){
	res.sendFile(viewsPath + "index.html");
});

app.use('/', router);

var port = 8000;
app.listen(port, function(){
	console.log(`The frontend server is running on port ${port}.`)
});