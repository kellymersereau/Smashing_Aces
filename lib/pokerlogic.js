function sortArr(arr){

    
     var rankedArr = arr.sort(function(a, b) //sorts array in descending order
        {
            return b - a;
        });
    return rankedArr;

}


BestHandInfo = function(nameOfHand, rankOfHand, highCard) {
        this.nameOfHand = nameOfHand,
        this.rankOfHand = rankOfHand,
        this.highToLow = highCard
}

function checkHighCard(rankArr) {

   
    var handInfo = new BestHandInfo("High Card", 1, [rankArr[0], rankArr[1], rankArr[2]]);

    return handInfo; // returns highest card in sorted array
};

function checkPair(rankArr) {

    var highPairCard = 0;
    var kicker = 0;
    for (i = 0; i < 2; i++) {
        if (rankArr[i] == rankArr[i + 1]) {
            highPairCard = rankArr[i];
        };
    };
    if (highPairCard > 0) { //only executes if a pair was found
        for (i = 0; i < rankArr.length; i++) {
            if (rankArr[i] != highPairCard) {
                kicker = rankArr[i];
            };
        };
        var handInfo = {
            nameOfHand: "Pair",
            rankOfHand: 2,
            highPairCard: highPairCard,
            kicker: kicker
        };
        return handInfo;
    } else {
        return false;
    }
};

function checkFlush(cardSuites, rankArr) {

    
   
    if ((cardSuites[0] === cardSuites[1]) && (cardSuites[2] === cardSuites[1])) {
        var handInfo = new BestHandInfo("Flush", 3, [rankArr[0], rankArr[1], rankArr[2]]);
        console.log('THIS IS THE FLUSH HANDINFO: ');
        return handInfo;
    } else {
        return false;
    };
};

function checkStraight(rankArr) {

    //this if checks if there is an ace, queen, and king. ace being 14.

    if ((rankArr.indexOf(14) > (-1)) && (rankArr.indexOf(2) > (-1)) && (rankArr.indexOf(3) > (-1))) {

        var handInfo = new BestHandInfo("Straight", 4, 3);
        return handInfo;
    } else if (((rankArr[0] - rankArr[1]) == 1) && ((rankArr[1] - rankArr[2]) == 1)) {

        var handInfo = new BestHandInfo("Straight", 4, rankArr[0]);
        return handInfo;
    } else {
        return false;
    };
};

function checkThreeKind(rankArr) {
  
    if ((rankArr[0] == rankArr[1]) && (rankArr[2] == rankArr[1])) {
        var handInfo = new BestHandInfo("Three of a kind", 5, rankArr[0]);
        return handInfo;
    } else {
        return false;
    };
};


function payOuts(playerHandOutcome, playerHand, antebet, pairPlus) {

    console.log("-------------betinfo------------------")
    console.log(playerHandOutcome);
    console.log('This is the players  hand rank ' + playerHand.rankOfHand);
    console.log('this is the players hand name' + playerHand.nameOfHand)
    console.log('antebet: ' + antebet);
    console.log('pairPlus bet: ' + pairPlus);

    var pairPlus = parseInt(pairPlus);
    var antebet = parseInt(antebet);
    var amountWonLost = 0;

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
            amountWonLost = amountWonLost - (antebet * 2);
            break;
    };


    if ((playerHand.rankOfHand > 1) && (pairPlus > 0)) {

        switch (playerHand.rankOfHand) {

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
    } else {
        amountWonLost = amountWonLost - pairPlus;
    };

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
 
    return amountWonLost;

};

pokerFunctions = {

 getBestHand: function(rankArr, suiteArr) {
    rankArr = sortArr(rankArr);
    if ((checkFlush(suiteArr, rankArr) != false) && ((checkStraight(rankArr) != false))) {
        var straightFlush = new BestHandInfo('Straight Flush', 6, rankArr[0]);
        return straightFlush;
    } else if (checkThreeKind(rankArr) != false) {
        return checkThreeKind(rankArr);
    } else if (checkStraight(rankArr) != false) {
        return checkStraight(rankArr);
    } else if (checkFlush(suiteArr,rankArr) != false) {
        console.log('FLUSH IS TRUE');
        return(checkFlush(suiteArr,rankArr));
    } else if (checkPair(rankArr) != false) {
        return checkPair(rankArr);
    } else {
        return checkHighCard(rankArr);
    }
},

 getWinner: function (dealer, player, antebet, pairplus) {
    console.log('BEST DEALER HAND: '+dealer);
    console.log('BEST PLAYER HAND: '+player);

    if ((dealer.rankOfHand == 1) && (dealer.highToLow[0] < 12)) {
        return payOuts('dealerOut', player, antebet, pairplus);
    };
    if (dealer.rankOfHand == player.rankOfHand) { // This begins checking when both hands are of equal value

        if ((player.rankOfHand == 4) || (player.rankOfHand == 5) || (player.rankOfHand == 6)) {

            if (player.highToLow > dealer.highToLow) {
                return payOuts('wins', player, antebet, pairplus);
            } else if (player.highToLow < dealer.highToLow) {
                return payOuts('loss', player, antebet, pairplus);
            } else {
                return payOuts('push', player, antebet, pairplus);
            };
        } else if ((player.rankOfHand == 1) || (player.rankOfHand == 3)) {

            playerWins = false;
            dealerWins = false;

            var c = 0;

            while (c < 3) {

                plCard = parseInt(player.highToLow[c]);
                dlCard = parseInt(dealer.highToLow[c]);

                if (plCard > dlCard) {
                    playerWins = true;
                    break;
                } else if (dlCard > plCard) {
                    dealerWins = true;
                    break;
                }

                c++;
            };



            if (playerWins) {
                return payOuts('wins', player, antebet, pairplus);
            } else if (dealerWins) {
                return payOuts('loss', player, antebet, pairplus);
            } else {
                return payOuts('push', player, antebet, pairplus);
            };
        }

        // if both have pairs
        else if ((player.rankOfHand == 2) && (dealer.rankOfHand == 2)) {
            if ((parseInt(player.highPairCard)) > (parseInt(dealer.highPairCard))) {
                return payOuts('wins', player, antebet, pairplus);
            } else if ((parseInt(player.highPairCard)) < (parseInt(dealer.highPairCard))) {
                return payOuts('loss', player, antebet, pairplus);
            } else {
                if ((parseInt(player.kicker)) > (parseInt(dealer.kicker))) {
                    return payOuts('wins', player, antebet, pairplus);
                } else if ((parseInt(player.kicker)) < (parseInt(dealer.kicker))) {
                    return payOuts('loss', player, antebet, pairplus);
                } else { payOuts('push', player, antebet, pairplus); }

            }
        }
    } else if (dealer.rankOfHand > player.rankOfHand) {
        return payOuts('loss', player, antebet, pairplus);
    } else if (dealer.rankOfHand < player.rankOfHand) {
        return payOuts('wins', player, antebet, pairplus);
    };
  }
};

module.exports = pokerFunctions;

