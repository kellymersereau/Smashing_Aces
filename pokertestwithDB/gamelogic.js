
var orm = require('./orm.js');

var connection = require('./connection.js');


BestHandInfo = function(nameOfHand,rankOfHand,highCard) {

		this.nameOfHand = nameOfHand,
		this.rankOfHand = rankOfHand,
		this.highToLow = highCard
	}


function dealCards() {

var	dealerHand = [];
var	playerHand = [];
var	dealerCardRanks = [];
var	dealerSuites = [];
var	playerCardRanks = [];
var	playerSuites = [];

connection.query("SELECT * FROM cards order by rand()", function(err, result){


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



console.log('ranks and suites')
console.log(dealerCardRanks,dealerSuites);
console.log(playerCardRanks,playerSuites);

bestPlayerHand = getBestHand(playerCardRanks,playerSuites);

bestDealerHand = getBestHand(dealerCardRanks,dealerSuites);

console.log(bestDealerHand);
console.log(bestPlayerHand);

getWinner(bestDealerHand,bestPlayerHand);


});






};

dealCards(); //function called to begin process of randomization and comparing hands;



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
			console.log('dealer out. balance = balance + antebet');
			break;
		case ('push'):
			console.log('push. balance = balance');
			break;
		case ('wins'):
			console.log('balance = balance + (antebet *2)');
			break;
		case ('loss'):
			console.log('balance = balance - (antebet * 2)'); 
			break;

	}

	if ((playerHand.rank > 1) && (pairPlus > 0)) {

			switch (playerHand.rank){

				case (2):
					console.log('balance = balance + pairPlus');
					break;
				case (3):
					console.log('balance = balance + (pairPlus * 4)');
					break;
				case (4):
					console.log('balance = balance + (pairPlus * 6)');
					break;
				case (5):
					console.log('balance = balance + (pairPlus * 30)');
					break;
				case (6):
					console.log('balance = balance + (pairPlus * 40)');
			}
	}

	switch (playerHand.rank) {

		case (4):
			console.log('balance = balance + antebet');
			break;
		case (5):
			console.log('balance = balance + (antebet * 4)');
			break;
		case (6):
			console.log('balance = balance + (antbet * 5)');
			break;
	}

}







