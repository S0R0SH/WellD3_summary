var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var router = express.Router();
var viewsPath = __dirname + '/views/';
var http = require('http')
var request = require('request');
var fs = require('fs')
var tools = require('./tools.js')();

app.use(express.static('./public'))
// app.use(express.static('libraries'))
app.use(express.static('/'))
app.use(bodyParser.urlencoded({extended: true}));

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

app.get('/', (req, res) => {
  console.log(req.body)

  res.redirect('back');
});

app.get('/getdata', (req, res) => {

	request('http://localhost:3001/wells/well_data?well_num=2', function (err, response, body) {
	  if (!err && response.statusCode == 200) {
	    console.log("got the data") // Print the google web page.

	    fs.writeFile('./public/jsonData/depthData.json', body, function(err){
	    	console.log("File Created");
	    });
	  } else {
	  	console.log(err)
	  }
	});

  res.redirect('back');
});






