
//-----------------------------------------------------------------------------------------

var orm = require('./orm.js');
var Promise = require('promise');
var connection = require('./connection.js');


// obtain random cards for game

 dealerSuites = [];
 dealerCardRanks = [];

var	dealerHand = [];
var	playerHand = [];
var	dealerCardRanks = [];
var	dealerSuites = [];
var	playerCardRanks = [];
var	playerSuites = [];
var needThis = [];
var closerFunction;
var	condition;

console.log('hi');

function getCard(condition, cb){
	orm.findOne('cards',condition,function(result) {
		
		cb(result);
	});

};

// function randomCard(cardsDealt) {

// 			var card = (Math.floor((Math.random() * 52) + 1));

// };

var gameDeck = [];

function dealCards() {
		
//console.log(connection)

var dealerHand = [];
var playerHand = [];

connection.query("SELECT * FROM cards order by rand()", function(err, result){

//gameDeck = result;

for(var i=0; i<result.length; i++){

	gameDeck[result[i].id]={id: result[i].id, rank: result[i].rank, suite: result[i].suite, image_link: result[i].image_link, dealt: 0};

}


console.log(gameDeck);

var allCards=result;

dealerHand.push({id:allCards[0].id, rank: allCards[0].rank, suite: allCards[0].suite});
playerHand.push({id:allCards[1].id, rank: allCards[1].rank, suite: allCards[1].suite});

dealerHand.push({id:allCards[2].id, rank: allCards[2].rank, suite: allCards[2].suite});
playerHand.push({id:allCards[3].id, rank: allCards[3].rank, suite: allCards[3].suite});

dealerHand.push({id:allCards[4].id, rank: allCards[4].rank, suite: allCards[4].suite});
playerHand.push({id:allCards[5].id, rank: allCards[5].rank, suite: allCards[5].suite});


console.log(dealerHand);
console.log(playerHand);

for(var i=0; i<dealerHand.length; i++){
	gameDeck[dealerHand[i].id].dealt=1;
}

for(var i=0; i<playerHand.length; i++){
	gameDeck[playerHand[i].id].dealt=1;
}

console.log(gameDeck);




});





// orm.all('cards',condition,function(result) {

// console.log(result)		

// 	});



// 		for (i = 0; i < 3; i++) {

// 			var dealerCard = Math.floor((Math.random() * 52) + 1);
// 			dealerHand.push(dealerCard);

// 			var playerCard = Math.floor((Math.random() * 52) + 1);
// 			playerHand.push(playerCard);

// 		};

// var yourArray = dealerHand;
// var counter = [];

// yourArray.forEach(function(name){

// 	console.log("this" +name);
//     // conn.collection(name).drop(function(err) {
//     //     counter.push(true);
//     //     console.log('dropped');
//     //     if(counter.length === yourArray.length){
//     //         console.log('all dropped');
//     //     }
//     // });

// 			condition = 'id='+name;	


// 			getCard(condition, function(result) {
// //				console.log(result)
// 				dealerCardRanks.push(result[0].rank);
// 				dealerSuites.push(result[0].suite);
// 				 console.log(dealerSuites);
// 				//return dealerSuites
// 				});


// });




		// for (i = 0; i < 3;i++) {
		// 	condition = 'id='+dealerHand[i];	
			
		// 	getCard(condition, function(result) {
		// 		console.log(result)
		// 		dealerCardRanks.push(result[0].rank);
		// 		dealerSuites.push(result[0].suite);
		// 		 console.log(dealerSuites);
		// 		//return dealerSuites
		// 		});
				
		// }
		// WHY ARE YOU NOT RETURNING?!?!?!??!?!?!?!??

		// console.log("hey hey hey", dealerSuites);
		// console.log('timing issues still???');
		// console.log("LOOK HERE FIRST", dealerSuites);
		
		
		// console.log(dealerHandIndexes);
	
}	

console.log(dealCards());

// var suites = dealCards();
// console.log('these are the suites', suites);
// suites;

		// 		// connection.query('SELECT * FROM CARDS where id = ?',[playerHand[i]],function(err,result) {
				
		// 		// playerCardRanks.push(result[0].rank);
		// 		// playerSuites.push(result[0].suite);

					
		// 		// 	});

			// if (i == 2) {

			// 	// var handsArray = [playerHand,playerCardRanks,playerSuites,dealerHand,dealerCardRanks,dealerSuites];
			// 	return(dealerSuites);

			// 
		 



 

// for (i = 0; i < 3; i++) {

// 	splitCard = playerHand[i].match(/[a-zA-Z]+|[0-9]+/g);

// 	playerCardRanks.push(splitCard[0]);

// 	playerSuites.push(splitCard[1]);


// 	splitCard = dealerHand[i].match(/[a-zA-Z]+|[0-9]+/g);

// 	dealerCardRanks.push(splitCard[0]);

// 	dealerSuites.push(splitCard[1]);

// 	$('#dealer').append(dealerHand[i]);
// 	$('#player').append(playerHand[i]);
// }

// // console.log(dealerHand);

// // console.log(dealerCardRanks);

// // console.log(dealerSuites);

//  BestHandInfo = function(nameOfHand,rankOfHand,highCard) {

// 		this.nameOfHand = nameOfHand,
// 		this.rankOfHand = rankOfHand,
// 		this.highCard = highCard
// 	}




// function checkHighCard (rankArr) {

// 	rankArr = rankArr.sort(function(a, b) //sorts array in descending order
// 		{return b-a});

// 	var handInfo = new BestHandInfo("High Card",1,rankArr[0]);

// 	return handInfo;  // returns highest card in sorted array
// }

// function checkPair (rankArr) {

// 	rankArr = rankArr.sort(function(a, b) //sorts array in descending order
// 		{return b-a});

// 	var highPairCard = 0;

// 	var kicker = 0;


// 	for (i=0;i < 2; i++) {
// 		if (rankArr[i] == rankArr[i+1]) {

// 			highPairCard = rankArr[i];
// 		}
// 	}

// 	if (highPairCard > 0) {			//only executes if a pair was found

// 		for (i=0;i<rankArr.length;i++) {

// 			if (rankArr[i]!=highPairCard) {

// 				kicker = rankArr[i];
// 			}
// 		}

// 	var handInfo = new BestHandInfo("Pair",2,kicker);

// 	 return handInfo;
// 	}

// 	else {

// 		return false; 
// 	}


// }

// function checkFlush (cardSuites,rankArr) {

// 	if ((cardSuites[0] == cardSuites[1]) && (cardSuites[2] == cardSuites[1])) {

// 		var handInfo = new BestHandInfo("Flush",3,rankArr[0]);
// 		return handInfo;
// 	}
// 	else {

// 		return false;
// 	}
// }



// function checkStraight(rankArr) {


// 	rankArr = rankArr.sort(function(a, b) //sorts array in descending order
// 		{return b-a});


// 	//this if checks if there is an ace, queen, and king. ace being 1.

// 	if ((rankArr.indexOf(1) > (-1)) && (rankArr.indexOf(12) > (-1)) && (rankArr.indexOf(13) > (-1))) {

// 		var handInfo = new BestHandInfo("Straight",4,14); 
// 		return handInfo;
// 	}

	

// 	if (((rankArr[0] - rankArr[1]) == 1) && ((rankArr[1] - rankArr[2]) == 1)) {

// 		 var handInfo = new BestHandInfo("Straight",4,rankArr[0]); 
// 		 return handInfo;
// 	 }
// 	else {

// 		return false;
// 	}


// }


// function checkThreeKind (rankArr) {

// 	if ((rankArr[0] == rankArr[1]) && (rankArr[2] == rankArr[1])) {

// 		var handInfo = new BestHandInfo("Three of a kind",5,rankArr[0]);
// 		return handInfo;
// 	}
// 	else {

// 		return false;
// 	}

// }










// function getBestHand (rankArr,suiteArr) {



// 		if ((checkFlush(suiteArr,rankArr) != false) && ((checkStraight(rankArr) != false))) {
			 
// 			 var straightFlush = new BestHandInfo('Straight Flush',rankArr[0],rankArr[0]);

// 			 return straightFlush;
// 		}
// 		else
// 		 if (checkThreeKind(rankArr) != false) {
// 			 return checkThreeKind(rankArr);
// 		}
// 		else if (checkStraight(rankArr) != false) {
// 			 return checkStraight(rankArr);
// 		}
// 		else if (checkPair(rankArr)!=false) {
// 			 return checkPair(rankArr);
// 		}
// 		else {
// 			return checkHighCard(rankArr);
// 		}



//   }


// bestPlayerHand = getBestHand(playerCardRanks,playerSuites);

// bestDealerHand = getBestHand(dealerCardRanks,dealerSuites);