/*
Here is where you create all the functions that will do the routing for your app, and the logic of each route.
*/
var express = require('express');
var router = express.Router();
var card = require('../models/card.js');
//this route has pointed to the index.handlebars page in all of the previous exercises, not sure if we will need both a main.handlebars AND an index.handlebars (or whatever.handlebars as long as its different than main.handlebars).

router.get('/', function(req, res){
	res.redirect('/home')
});

router.get('/game', function(req,res) {
	card.all(function(data){
		var hbsObject = {
			cards : data,
			logged_in: req.session.logged_in
		}
		console.log(hbsObject)
		res.render('main', hbsObject);
	});
});
//i changed 'sleepy' to 'e-mail', but I'm not sure if this is needed.
router.post('/create', function(req,res) {
	card.create(['name', 'e-mail'], [req.body.name, req.body.email], function(data){
		res.redirect('/home')
	});
});
//not sure if we need an update put route??
router.put('/update/:id', function(req,res) {
	var condition = 'id = ' + req.params.id;

	console.log('condition', condition);

	card.update({'sleepy' : req.body.sleepy}, condition, function(data){
		res.redirect('/cards');
	});
});

router.delete('/delete/:id', function(req,res) {
	var condition = 'id = ' + req.params.id;

	card.delete(condition, function(data){
		res.redirect('/home');
	});
});

module.exports = router;




// var express = require('express');
// var router = express.Router();
// var burgers = require('../models/card.js');

// router.get('/', function(req, res){
// 	res.redirect('/home')
// });

// router.get('/game', function(req, res){
// 	burgers.all(function(data){
// 		var hbsObject = {cards: data};

// 		console.log(hbsObject);

// 		res.render('index', hbsObject);
// 	});
// });


// module.exports = router;