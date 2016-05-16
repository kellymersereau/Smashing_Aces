var express = require('express');
var router = express.Router();
var burgers = require('../models/card.js');

router.get('/', function(req, res){
	res.redirect('/home')
});

router.get('/game', function(req, res){
	burgers.all(function(data){
		var hbsObject = {cards: data};

		console.log(hbsObject);

		res.render('index', hbsObject);
	});
});


module.exports = router;