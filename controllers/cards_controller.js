/*
Here is where you create all the functions that will do the routing for your app, and the logic of each route.
*/
var express = require('express');
var router = express.Router();
var card = require('../models/cards.js');
var user = require('../models/cards.js');
var connection = require('../config/connection.js');

// var dealerHand = [];
// var playerHand = [];
// var dealerCardRanks = [];
// var dealerSuites = [];
// var playerCardRanks = [];
// var playerSuites = [];


// router.get('/game/:id', function(req,res) {
// 	console.log('this is req.session.id ' + req.session.id);
// 	console.log('this is req.session.logged_in ' + req.session.logged_in);
// 	req.session.id = req.params.id;
// 	var condition = "id=" + req.params.id;

// 	user.findOne(condition, function(data){
// 		var hbsObject = {
// 			users: data[0],
// 			logged_in: req.session.logged_in,
// 			bet: true,
// 			raise: false,
// 			fold: false
// 		}
// 		console.log(hbsObject)
// 		res.render('cardgame', hbsObject);
// 	});
// });

// router.post('/antebets/:id', function(req, res) {
//   req.session.id = req.params.id;
//   var condition = "id=" + req.params.id;

//   console.log('this is req.session.id ' + req.session.id);
//   console.log('this is req.session.logged_in ' + req.session.logged_in);

//   connection.query("SELECT * FROM cards order by rand()", function(err, result) {

//     dealerHand.push({ id: result[0].id, rank: result[0].rank, suite: result[0].suite, img: result[0].image_link, back_img: result[0].back_image_link });
//     playerHand.push({ id: result[1].id, rank: result[1].rank, suite: result[1].suite, img: result[1].image_link, back_img: result[1].back_image_link  });

//     dealerHand.push({ id: result[2].id, rank: result[2].rank, suite: result[2].suite, img: result[2].image_link, back_img: result[2].back_image_link  });
//     playerHand.push({ id: result[3].id, rank: result[3].rank, suite: result[3].suite, img: result[3].image_link, back_img: result[3].back_image_link  });

//     dealerHand.push({ id: result[4].id, rank: result[4].rank, suite: result[4].suite, img: result[4].image_link, back_img: result[4].back_image_link  });
//     playerHand.push({ id: result[5].id, rank: result[5].rank, suite: result[5].suite, img: result[5].image_link, back_img: result[5].back_image_link  });


//     for (i = 0; i < 3; i++) {
//       dealerCardRanks.push(parseInt(dealerHand[i].rank));
//       dealerSuites.push(dealerHand[i].suite);

//       playerCardRanks.push(parseInt(playerHand[i].rank));
//       playerSuites.push(playerHand[i].suite);

//     }

//     antebet = parseInt(req.body.antebet);

//     pairPlusBet = parseInt(req.body.pairplusbet);

//     // res.render('daves_stuff/choose_play', {
//     res.render('cardgame', {
//       pairbet: pairPlusBet,
//       anteBet: antebet,
//       playerHand: playerHand,
//       dealerHand: dealerHand
//     });

//   });

// });

module.exports = router;


