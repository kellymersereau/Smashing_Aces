
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

	//make sure the user 4 exists - if not change to a user that does exist with play_money
	connection.query("SELECT * FROM users where id = ?", [4], function(err, result){

		res.render('index',{play_money: result[0].play_money});
		
	});
});



var	dealerHand = [];
var	playerHand = [];
var	dealerCardRanks = [];
var	dealerSuites = [];
var	playerCardRanks = [];
var	playerSuites = [];

var dealerHandBack = [];



app.post('/antebets',function(req,res){
	connection.query("SELECT * FROM cards WHERE id = 53", function(err, result){
		dealerHandBack.push({img: result[0].image_link});
		dealerHandBack.push({img: result[0].image_link});
		dealerHandBack.push({img: result[0].image_link});
	});

	connection.query("SELECT * FROM cards order by rand()", function(err, result){

			dealerHand.push({id:result[0].id, rank: result[0].rank, suite: result[0].suite, img:result[0].image_link});
			playerHand.push({id:result[1].id, rank: result[1].rank, suite: result[1].suite, img:result[1].image_link});

			dealerHand.push({id:result[2].id, rank: result[2].rank, suite: result[2].suite, img:result[2].image_link});
			playerHand.push({id:result[3].id, rank: result[3].rank, suite: result[3].suite, img:result[3].image_link});

			dealerHand.push({id:result[4].id, rank: result[4].rank, suite: result[4].suite, img:result[4].image_link});
			playerHand.push({id:result[5].id, rank: result[5].rank, suite: result[5].suite, img:result[5].image_link});


			for (i = 0; i < 3;i++) {
				dealerCardRanks.push(parseInt(dealerHand[i].rank));
				dealerSuites.push(dealerHand[i].suite);

				playerCardRanks.push(parseInt(playerHand[i].rank));
				playerSuites.push(playerHand[i].suite);

			} 


		


	antebet = parseInt(req.body.antebet);

	pairPlusBet = parseInt(req.body.pairplusbet);


	res.render('choose_play',{
		pairbet:pairPlusBet,
		bet : antebet,
		playerHand: playerHand,
		dealerHand:dealerHand
	});

  });

});

//var resultFromHand=true;


app.post('/playdecision',function(req,res){
	if (req.body.decision === "bet"){
		
			// console.log('ranks and suites');
			
			// console.log('this is player ranks '+playerCardRanks,playerSuites);
			// console.log('this is dealer ranks '+dealerCardRanks,dealerSuites);
			
			antebet = req.body.antebet;
			pairPlusBet = req.body.pairplusbet;

			bestPlayerHand = getBestHand(playerCardRanks,playerSuites);

			bestDealerHand = getBestHand(dealerCardRanks,dealerSuites);

			// console.log('VARIABLES GOING INTO GETWINNER');
			// console.log(bestPlayerHand);
			// console.log(bestDealerHand);
			// console.log('antebet'+antebet);
			// console.log('pair pairPlusBet '+pairPlusBet);
			
			resultFromHand = getWinner(bestDealerHand,bestPlayerHand,antebet,pairPlusBet); //Money to add or deduct from current balance


			connection.query("SELECT * FROM users where id = ?", [4], function(err, result){

				console.log("resultfromhand before updated query: "+resultFromHand);

				console.log('win or lose = '+resultFromHand);
				var newBalance = parseInt(result[0].play_money) + resultFromHand;
				console.log('this is the new balance: '+newBalance);
				console.log('from if!')
				cashAdjust(res,newBalance);

				var playerHandTwo = playerHand;
				var dealerHandTwo = dealerHand;

				var showCards = {
					playerHand:playerHandTwo,
					dealerHand:dealerHandTwo,
					resultFromHand:resultFromHand
				}

				playerHand = [];
				dealerHand = [];
				dealerCardRanks = [];
				dealerSuites = [];
				playerCardRanks = [];
				playerSuites = [];

				res.render('showcards', showCards);
				
			}); //END OF SQL QUERY TO GET PLAYER'S CURRENT BALANCE AND ADD/SUBTRACT BET DEPENDING ON WINNINGS

			function cashAdjust(res, value){
				connection.query("UPDATE users SET play_money = ? WHERE id = ?", [value, 4], function(err, result){
					//res.redirect('/');
					console.log('done updating from cashAdjust function')
				});
			}

		  } //END OF IF STATEMENT IF PLAYER WANTED TO BET AND DID NOT FOLD	

	else {
		connection.query("SELECT * FROM users where id = ?", [4], function(err, result){

			newBalance = result[0].play_money - antebet - pairPlusBet;
			console.log('from else!')
			cashAdjust(res,newBalance);
			//weird
				dealerHand = [];
				playerHand = [];
				dealerCardRanks = [];
				dealerSuites = [];
				playerCardRanks = [];
				playerSuites = [];
			res.redirect('/');

		});

	}
}); //End of POST /PLAYDECISION

// 	}); //END OF SQL QUERY
// }); //END OF POST /ANTEBETS


	




// var orm = require('./orm.js');




BestHandInfo = function(nameOfHand,rankOfHand,highCard) {

		this.nameOfHand = nameOfHand,
		this.rankOfHand = rankOfHand,
		this.highToLow = highCard
}







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




function getWinner(dealer,player,antebet,pairplus) {


	console.log(dealer);
	if ((dealer.rankOfHand == 1) && (dealer.highToLow[0] < 12)) {

		return payOuts('dealerOut',player,antebet,pairplus);
	}


	if (dealer.rankOfHand == player.rankOfHand) {  // This begins checking when both hands are of equal value

		if ((player.rankOfHand == 4) || (player.rankOfHand == 5) || (player.rankOfHand == 6)) {

					 if (player.highToLow > dealer.highToLow) {
					 	return payOuts('wins',player,antebet,pairplus);
					 }
					else if (player.highToLow < dealer.highToLow) {
						return payOuts('loss',player,antebet,pairplus); }
					else {
						 return payOuts('push',player,antebet,pairplus);
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
			return payOuts('wins',player,antebet,pairplus);
		}
		else if (dealerWins){
			return payOuts('loss',player,antebet,pairplus);
		}
		else {return payOuts('push',player,antebet,pairplus);}
		}

	// if both have pairs

	else if ((player.rankOfHand == 2) && (dealer.rankOfHand == 2)) {
		if ((Number(player.highPairCard)) > (Number(dealer.highPairCard))) {
			return payOuts('wins',player,antebet,pairplus);
		}
		else if ((Number(player.highPairCard)) < (Number(dealer.highPairCard))) {
			return payOuts('loss',player,antebet,pairplus);
		}
		else { 
			if ((Number(player.kicker)) > (Number(dealer.kicker))){
				return payOuts('wins',player,antebet,pairplus);
			}
			else if ((Number(player.kicker)) < (Number(dealer.kicker))){
				return payOuts('loss',player,antebet,pairplus);
			}
			else { payOuts('push',player,antebet,pairplus); }

		}
	}
  }	
	
	else if (dealer.rankOfHand > player.rankOfHand) {
		return payOuts('loss',player,antebet,pairplus);
	}
	else if (dealer.rankOfHand < player.rankOfHand){
		return payOuts('wins',player,antebet,pairplus);
	}
	
}

function payOuts(playerHandOutcome,playerHand,antebet,pairPlus) {

	console.log("-------------betinfo------------------")
	console.log(playerHandOutcome);
	console.log('This is the players  hand rank '+playerHand.rankOfHand);
	console.log('this is the players hand name' + playerHand.nameOfHand)
	 console.log('antebet: '+antebet);
	 console.log('pairPlus bet: '+pairPlus);

	var amountWonLost=0;

	console.log("------------TYPES OF");
	console.log(typeof playerHand.rankOfHand);
	console.log(typeof antebet);
	console.log(typeof pairPlus);

	switch (playerHandOutcome) {

		
		case ('dealerOut'):
			amountWonLost = antebet;
			break;
		case ('push'):
			amountWonLost = amountWonLost;
			break;
		case ('wins'):
			amountWonLost = amountWonLost + (antebet * 2); // playbet = antetbet so if you win hand, you get antebet * 2 added to balance
			break;
		case ('loss'):
			amountWonLost = amountWonLost - (antebet*2);
			break;

	}


	if ((playerHand.rankOfHand > 1) && (pairPlus > 0)) {

			switch (playerHand.rankOfHand){

				case (2):
					amountWonLost = amountWonLost + pairPlus;
					break;
				case (3):
					amountWonLost = amountWonLost + (pairPlus * 4);
					break;
				case (4):
					amountWonLost = amountWonLost + (pairPlus * 6);
					break;
				case (5):
					amountWonLost = amountWonLost + (pairPlus * 30);
					break;
				case (6):
					amountWonLost = amountWonLost + (pairPlus * 40);
			}
	}
	else {
		amountWonLost = amountWonLost - pairPlus;
	}

	switch (playerHand.rankOfHand) {

		case (4):
			amountWonLost = amountWonLost + antebet;
			break;
		case (5):
			amountWonLost = amountWonLost + (antebet * 4);
			break;
		case (6):
			amountWonLost = amountWonLost + (antbet * 5);
			break;
	}
	console.log ('amountwonorLOST-------');
	console.log(amountWonLost);
	return amountWonLost;

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
















