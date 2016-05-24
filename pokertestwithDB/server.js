var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var connection = require('./connection.js');

var app = express();

//Serve static content for the app from the "public" directory in the application directory.
app.use(logger('dev'));
app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({
	extended: false
}))

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

app.get('/',function (req,res){

	connection.query("SELECT * FROM users where id = ?", [1], function(err, result){
	res.render('index',{play_money:result[0].play_money});
		
		});
});

app.post('/antebets',function(req,res){
	

	connection.query("SELECT * FROM cards order by rand()", function(err, result){

				var	dealerHand = [];
		var	playerHand = [];
		var	dealerCardRanks = [];
		var	dealerSuites = [];
		var	playerCardRanks = [];
		var	playerSuites = [];


			dealerHand.push({id:result[0].id, rank: result[0].rank, suite: result[0].suite, img:result[0].image_link});
			playerHand.push({id:result[1].id, rank: result[1].rank, suite: result[1].suite, img:result[1].image_link});

			dealerHand.push({id:result[2].id, rank: result[2].rank, suite: result[2].suite, img:result[2].image_link});
			playerHand.push({id:result[3].id, rank: result[3].rank, suite: result[3].suite, img:result[3].image_link});

			dealerHand.push({id:result[4].id, rank: result[4].rank, suite: result[4].suite, img:result[4].image_link});
			playerHand.push({id:result[5].id, rank: result[5].rank, suite: result[5].suite, img:result[5].image_link});


			for (i = 0; i < 3;i++) {
				dealerCardRanks.push(dealerHand[i].rank);
				dealerSuites.push(dealerHand[i].suite);

				playerCardRanks.push(playerHand[i].rank);
				playerSuites.push(playerHand[i].suite);

			} 




	antebet = parseInt(req.body.antebet);

	res.render('choose_play',{
		bet : antebet,
		playerHand: playerHand
	});



app.post('/playdecision',function(req,res){
	if (req.body.decision === "bet"){
		//dealcards(); // we'll do this later

		

		// connection.query("SELECT * FROM cards order by rand()", function(err, result){


		// 	dealerHand.push({id:result[0].id, rank: result[0].rank, suite: result[0].suite, img:result[0].image_link});
		// 	playerHand.push({id:result[1].id, rank: result[1].rank, suite: result[1].suite, img:result[1].image_link});

		// 	dealerHand.push({id:result[2].id, rank: result[2].rank, suite: result[2].suite, img:result[2].image_link});
		// 	playerHand.push({id:result[3].id, rank: result[3].rank, suite: result[3].suite, img:result[3].image_link});

		// 	dealerHand.push({id:result[4].id, rank: result[4].rank, suite: result[4].suite, img:result[4].image_link});
		// 	playerHand.push({id:result[5].id, rank: result[5].rank, suite: result[5].suite, img:result[5].image_link});


		// 	for (i = 0; i < 3;i++) {
		// 		dealerCardRanks.push(dealerHand[i].rank);
		// 		dealerSuites.push(dealerHand[i].suite);

		// 		playerCardRanks.push(playerHand[i].rank);
		// 		playerSuites.push(playerHand[i].suite);

		// 	} 



			console.log('ranks and suites')
			console.log(dealerCardRanks,dealerSuites);
			console.log(playerCardRanks,playerSuites);

			bestPlayerHand = getBestHand(playerCardRanks,playerSuites);

			bestDealerHand = getBestHand(dealerCardRanks,dealerSuites);

			console.log(bestDealerHand);
			console.log(bestPlayerHand);

			var capture = getWinner(bestDealerHand,bestPlayerHand);

			function cashAdjust(res, value, capture){
				connection.query("UPDATE users SET play_money = ? WHERE id = ?", [value, 1], function(err, result){
					res.redirect('/');
				});
				
			}


			connection.query("SELECT * FROM users where id = ?", [1], function(err, result){

				switch (capture) {

					case ('dealer out. balance = balance + antebet'):
						//do a sql query grab their balance - add the antebet to it and do an update to their balance with the new number
						console.log('works');
						
							var newBalance = parseInt(result[0].play_money) + parseInt(req.body.antebet);
							console.log('-----------------------')
							console.log(newBalance)
							console.log('-----------------------')
							// res.sendStatus(newBalance);
							cashAdjust(res, newBalance, capture);
							console.log('hello inside query');
							// res.render('showcards', {
							
							// 	play_money:result[0].play_money
							// });

							// res.render('showcards', {
							// 	dealerHand: dealerHand,
							// 	playerHand: playerHand,
							// 	capture : capture

							// });
						//return 'dealer out';
						break;
					case ('push. balance = balance'):
							
						var newBalance = parseInt(result[0].play_money);
						console.log('-----------------------')
						console.log(newBalance)
						console.log('-----------------------')
						//res.sendStatus(newBalance);
						cashAdjust(res, newBalance, capture);
						console.log('hello inside query');
						// res.render('showcards', {
						
						// 	play_money:result[0].play_money
						// });

						//return 'push. balance = balance';
						break;
					case ('balance = balance + (antebet *2)'):
							
						var newBalance = parseInt(result[0].play_money) + parseInt(req.body.antebet)*2;
						console.log('-----------------------')
						console.log(newBalance)
						console.log('-----------------------')
						//res.sendStatus(newBalance);
						cashAdjust(res, newBalance, capture);
						console.log('hello inside query');
						// res.render('showcards', {
						
						// 	play_money:result[0].play_money
						// });

						//return 'balance = balance + (antebet *2)';
						break;
					case ('balance = balance - (antebet * 2)'):
						var newBalance = parseInt(result[0].play_money) - parseInt(req.body.antebet)*2;
						console.log('-----------------------')
						console.log(newBalance)
						console.log('-----------------------')
						//res.sendStatus(newBalance);
						cashAdjust(res, newBalance, capture);
						console.log('hello inside query');
						// res.render('showcards', {
						
						// 	play_money:result[0].play_money
						// });

						//return 'balance = balance - (antebet * 2)';
						break;

				}
			}); //END OF SQL QUERY TO GET PLAYER'S CURRENT BALANCE AND ADD/SUBTRACT BET DEPENDING ON WINNINGS


		  } //END OF IF STATEMENT IF PLAYER WANTED TO BET AND DID NOT FOLD	

	else {
		connection.query("SELECT * FROM users where id = ?", [1], function(err, result){

			newBalance = result[0].play_money - antebet;
			cashAdjust(res,newBalance,capture);

			});

		
	}


		}); //End of POST /PLAYDECISION
	}); //END OF SQL QUERY
}); //END OF POST /ANTEBETS


	




// var orm = require('./orm.js');




BestHandInfo = function(nameOfHand,rankOfHand,highCard) {

		this.nameOfHand = nameOfHand,
		this.rankOfHand = rankOfHand,
		this.highToLow = highCard
}


// function dealCards() {

// 	var	dealerHand = [];
// 	var	playerHand = [];
// 	var	dealerCardRanks = [];
// 	var	dealerSuites = [];
// 	var	playerCardRanks = [];
// 	var	playerSuites = [];

// 	connection.query("SELECT * FROM cards order by rand()", function(err, result){


// 	dealerHand.push({id:result[0].id, rank: result[0].rank, suite: result[0].suite, img:result[0].image_link});
// 	playerHand.push({id:result[1].id, rank: result[1].rank, suite: result[1].suite, img:result[1].image_link});

// 	dealerHand.push({id:result[2].id, rank: result[2].rank, suite: result[2].suite, img:result[2].image_link});
// 	playerHand.push({id:result[3].id, rank: result[3].rank, suite: result[3].suite, img:result[3].image_link});

// 	dealerHand.push({id:result[4].id, rank: result[4].rank, suite: result[4].suite, img:result[4].image_link});
// 	playerHand.push({id:result[5].id, rank: result[5].rank, suite: result[5].suite, img:result[5].image_link});


// 		for (i = 0; i < 3;i++) {
// 			dealerCardRanks.push(dealerHand[i].rank);
// 			dealerSuites.push(dealerHand[i].suite);

// 			playerCardRanks.push(playerHand[i].rank);
// 			playerSuites.push(playerHand[i].suite);

// 		} 



// 	console.log('ranks and suites')
// 	console.log(dealerCardRanks,dealerSuites);
// 	console.log(playerCardRanks,playerSuites);

// 	bestPlayerHand = getBestHand(playerCardRanks,playerSuites);

// 	bestDealerHand = getBestHand(dealerCardRanks,dealerSuites);

// 	console.log(bestDealerHand);
// 	console.log(bestPlayerHand);

// 	getWinner(bestDealerHand,bestPlayerHand);


// 	});


// };





function checkHighCard (rankArr) {

	rankArr = rankArr.sort(function(a, b) //sorts array in descending order
		{return b-a});

	var handInfo = new BestHandInfo("High Card",1,[rankArr[0],rankArr[1],rankArr[2]]);

	return handInfo;  // returns highest card in sorted array
}

function checkPair (rankArr) {

	rankArr = rankArr.sort(function(a, b) //sorts array in descending order
		{return b-a});

	var highPairCard = 0;

	var kicker = 0;


	for (i=0;i < 2; i++) {
		if (rankArr[i] == rankArr[i+1]) {

			highPairCard = rankArr[i];
		}
	}

	if (highPairCard > 0) {			//only executes if a pair was found

		for (i=0;i<rankArr.length;i++) {

			if (rankArr[i]!=highPairCard) {

				kicker = rankArr[i];
			}
		}

	var handInfo = {
		nameOfHand:"Pair",
		rankOfHand:2,
		highPairCard:highPairCard,
		kicker:kicker
	}
	 return handInfo;
	}

	else {

		return false; 
	}
}

function checkFlush (cardSuites,rankArr) {


	rankArr = rankArr.sort(function(a, b) //sorts array in descending order
		{return b-a});


	if ((cardSuites[0] == cardSuites[1]) && (cardSuites[2] == cardSuites[1])) {

		var handInfo = new BestHandInfo("Flush",3,[rankArr[0],rankArr[1],rankArr[2]]);
		return handInfo;
	}
	else {

		return false;
	}
}



function checkStraight(rankArr) {


	rankArr = rankArr.sort(function(a, b) //sorts array in descending order
		{return b-a});


	//this if checks if there is an ace, queen, and king. ace being 14.

	if ((rankArr.indexOf(14) > (-1)) && (rankArr.indexOf(2) > (-1)) && (rankArr.indexOf(3) > (-1))) {

		var handInfo = new BestHandInfo("Straight",4,3); 
		return handInfo;
	}

	else if (((rankArr[0] - rankArr[1]) == 1) && ((rankArr[1] - rankArr[2]) == 1)) {

		 var handInfo = new BestHandInfo("Straight",4,rankArr[0]); 
		 return handInfo;
	 }

	else {

		return false;
	}


}


function checkThreeKind (rankArr) {

	if ((rankArr[0] == rankArr[1]) && (rankArr[2] == rankArr[1])) {

		var handInfo = new BestHandInfo("Three of a kind",5,rankArr[0]);
		return handInfo;
	}
	else {

		return false;
	}

}



function getBestHand (rankArr,suiteArr) {



		if ((checkFlush(suiteArr,rankArr) != false) && ((checkStraight(rankArr) != false))) {
			 
			 var straightFlush = new BestHandInfo('Straight Flush',6,rankArr[0]);

			 return straightFlush;
		}
		else
		 if (checkThreeKind(rankArr) != false) {
			 return checkThreeKind(rankArr);
		}
		else if (checkStraight(rankArr) != false) {
			 return checkStraight(rankArr);
		}
		else if (checkPair(rankArr)!=false) {
			 return checkPair(rankArr);
		}
		else {
			return checkHighCard(rankArr);
		}



  }




function getWinner(dealer,player) {



	if ((dealer.rankOfHand == 1) && (dealer.highToLow[0] < 12)) {
		return payOuts('dealerOut',player);
	}


	if (dealer.rankOfHand == player.rankOfHand) {  // This begins checking when both hands are of equal value

		if ((player.rankOfHand == 4) || (player.rankOfHand == 5) || (player.rankOfHand == 6)) {

					 if (player.highToLow > dealer.highToLow) {
					 	return payOuts('wins',player);
					 }
					else if (player.highToLow < dealer.highToLow) {
						return payOuts('loss',player); }
					else {
						 return payOuts('push',player);
					   }
		}

		else if ((player.rankOfHand == 1) || (player.rankOfHand == 3)) {

			playerWins = false;
			dealerWins = false;

			var c = 0;

			while (c < 3) {

					plCard = Number(player.highToLow[c]);
					dlCard = Number(dealer.highToLow[c]);

				if (plCard > dlCard) {
					playerWins = true;
					break;
				}
				else if (dlCard > plCard) {
					dealerWins = true;
					break;
				}

			c++;
			};
		

		
		if (playerWins) {
			return payOuts('wins',player);
		}
		else if (dealerWins){
			return payOuts('loss',player);
		}
		else {return payOuts('push',player);}
		}

	// if both have pairs

	else if ((player.rankOfHand == 2) && (dealer.rankOfHand == 2)) {
		if ((Number(player.highPairCard)) > (Number(dealer.highPairCard))) {
			payOuts('wins',player);
		}
		else if ((Number(player.highPairCard)) < (Number(dealer.highPairCard))) {
			payOuts('loss',player);
		}
		else { 
			if ((Number(player.kicker)) > (Number(dealer.kicker))){
				payOuts('wins',player);
			}
			else if ((Number(player.kicker)) < (Number(dealer.kicker))){
				payOuts('loss',player);
			}
			else { payOuts('push',player); }

		}
	}
  }	
	
	else if (dealer.rankOfHand > player.rankOfHand) {
		payOuts('loss',player);
	}
	else if (dealer.rankOfHand < player.rankOfHand){
		payOuts('wins',player);
	}
	
}

function payOuts(playerHandOutcome,playerHand,pairPlus) {

	switch (playerHandOutcome) {

		
		case ('dealerOut'):
			return 'dealer out. balance = balance + antebet';
			break;
		case ('push'):
			return 'push. balance = balance';
			break;
		case ('wins'):
			return 'balance = balance + (antebet *2)';
			break;
		case ('loss'):
			return 'balance = balance - (antebet * 2)';
			break;

	}

	if ((playerHand.rank > 1) && (pairPlus > 0)) {

			switch (playerHand.rank){

				case (2):
					return 'balance = balance + pairPlus';
					break;
				case (3):
					return 'balance = balance + (pairPlus * 4)';
					break;
				case (4):
					return 'balance = balance + (pairPlus * 6)';
					break;
				case (5):
					return 'balance = balance + (pairPlus * 30)';
					break;
				case (6):
					return 'balance = balance + (pairPlus * 40)';
			}
	}

	switch (playerHand.rank) {

		case (4):
			return 'balance = balance + antebet';
			break;
		case (5):
			return 'balance = balance + (antebet * 4)';
			break;
		case (6):
			return 'balance = balance + (antbet * 5)';
			break;
	}

}









// var application_controllers = require('./controllers/application_controllers.js');
// var cards_controller = require('./controllers/cards_controller.js');
// var user_controller = require('./controllers/user_controller.js');
// var game_controller = require('./controllers/game_controller.js');
// // var waitingRoom_controller = require('./controllers/waitingRoom_controller.js');

// app.use('/', application_controllers);
// app.use('/cards', cards_controller);
// app.use('/user', user_controller);
// app.use('/game', game_controller);
// app.use('/waitingRoom', waitingRoom_controller);

var port = process.env.PORT || 3000;
app.listen(port);

