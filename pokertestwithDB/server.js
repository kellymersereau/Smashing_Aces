//Dependencies

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var PORT = 3000 



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

//MAP OF ROUTES

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname + '/main.html'));
})


app.listen(PORT, function(err){

	console.log('app listening on: '+ PORT);

});


