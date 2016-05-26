//deals with the game itself
var express = require('express');
var router = express.Router();
var hand = require('../models/hands.js');

// router.get('/', function(req, res){
// 	res.redirect('/game')
// });

// router.get('/game', function(req,res) {
// 	hand.all(function(data){
// 		var hbsObject = {
// 			cards : data,
// 			logged_in: req.session.logged_in
// 		}
// 		console.log(hbsObject)
// 		res.render('cardgame', hbsObject);
// 	});
// });


//(kelly) it isn't needed to be e-mail but it is needed so we can push the players information into the hands table.  this will only be called when the user is placed into the game and finalizes their bets
// router.post('/create', function(req,res) {
// 	hand.create(['user_id'], [req.body.id], function(data){
// 		res.redirect('/game')
// 	});
// });


// (kelly) updates the deals table with the amount of money played for this user for this current deal

// router.put('/update/:id', function(req,res) {
// 	var condition = 'id = ' + req.params.id;

// 	console.log('condition', condition);

// 	hand.update({'pairs_plus' : req.body.pairsPlus, 'pairs_plus_bet' : req.body.pairsPlusBet, 'ante_bet' : req.body.anteBet, 'play_bet' : req.body.playBet}, condition, function(data){
// 		res.redirect('/game');
// 	});
// // });

// router.get('/game', function(req, res) {
// 	var users = {
// 		id: req.session.user_id
// 	}

// 	connection.query("SELECT * FROM users WHERE id = ?", [users], function(err, result){

// 		res.render('cardgame', {
// 			users,
// 			play_money: result[0].play_money,
// 			bet : true,
// 			raise : false,
// 			fold : false
// 		});
// 	});
// });


module.exports = router;