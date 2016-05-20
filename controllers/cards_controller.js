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


//(kelly) updates the deals-cards table with each card that is dealt during the game
router.put('/update/:card_id', function(req,res) {
	var condition = 'card_id = ' + req.params.card_id;

	console.log('condition', condition);

	//(kelly) updates the deals table with the cards played for each user during each deal - i'm not quite sure how to do this

	card.update('deals_cards', {''}, condition, function(data){
		res.redirect('/cards');
	});
});


module.exports = router;


