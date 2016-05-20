//deals with the game itself
var express = require('express');
var router = express.Router();
var hand = require('../models/hands.js');
//this route has pointed to the index.handlebars page in all of the previous exercises, not sure if we will need both a main.handlebars AND an index.handlebars (or whatever.handlebars as long as its different than main.handlebars).

router.get('/', function(req, res){
	res.redirect('/home')
});

router.get('/game', function(req,res) {
	hand.all(function(data){
		var hbsObject = {
			cards : data,
			logged_in: req.session.logged_in
		}
		console.log(hbsObject)
		res.render('main', hbsObject);
	});
});


//(kelly) it isn't needed to be e-mail but it is needed so we can push the players information into the hands table.  this will only be called when the user is placed into the game and finalizes their bets
router.post('/create', function(req,res) {
	hand.create(['user_id'], [req.body.id], function(data){
		res.redirect('/home')
	});
});

// (kelly) we need this to update the hands table and a separate one to update to update the deals_cards table with the information from each 

//(kelly)updates the hands table
router.put('/update/:id', function(req,res) {
	var condition = 'id = ' + req.params.id;

	console.log('condition', condition);

	// (kelly) updates the deals table with the amount of money played for this user for this current deal

	hand.update({'pairs_plus' : req.body.pairsPlus, 'pairs_plus_bet' : req.body.pairsPlusBet, 'ante_bet' : req.body.anteBet, 'play_bet' : req.body.playBet}, condition, function(data){
		res.redirect('/cards');
	});
});


module.exports = router;