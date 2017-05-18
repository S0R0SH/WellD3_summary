var express = require('express');
var app = express();
var router = express.Router();
var viewsPath = __dirname + '/views/';

app.use(express.static('public'))
// app.use(express.static('public/images'))
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