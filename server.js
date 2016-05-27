var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var connection = require('./config/connection.js');

var app = express();


//Serve static content for the app from the "public" directory in the application directory.
app.use(logger('dev'));
app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(session({
  secret: 'keyboard cat',
  // resave: true,
  // saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');


var application_controllers = require('./controllers/application_controllers.js');
var user_controller = require('./controllers/user_controller.js');


app.use('/', application_controllers);
app.use('/user', user_controller);


//---------------------------------LOGIC START-------------------------------------------------------

var dealerHand = [];
var playerHand = [];
var dealerCardRanks = [];
var dealerSuites = [];
var playerCardRanks = [];
var playerSuites = [];
var hbsObject = {};


app.post('/antebets/:id?', function(req, res) {
  if(req.session.user_id){
    req.params.id = req.session.user_id;
  }
    req.session.logged_in = true;
    req.session.user_id = req.params.id;
    var condition = "id=" + req.params.id;

    var queryString = 'SELECT * FROM users';
    queryString = queryString + ' WHERE ';
    queryString = queryString + condition;

    console.log(queryString);

    connection.query(queryString, function(err, results) {
      console.log('results.id -------', results[0].id);
      hbsObject = {
        users: results[0].id,
        logged_in: req.session.logged_in
      }
      console.log(hbsObject)
      return hbsObject;
    });

  console.log('this is req.session.id ' + req.session.id);
  console.log('this is req.session.logged_in ' + req.session.logged_in);

  connection.query("SELECT * FROM cards order by rand()", function(err, result) {

    dealerHand.push({ id: result[0].id, rank: result[0].rank, suite: result[0].suite, img: result[0].image_link, back_img: result[0].back_image_link });
    playerHand.push({ id: result[1].id, rank: result[1].rank, suite: result[1].suite, img: result[1].image_link, back_img: result[1].back_image_link });

    dealerHand.push({ id: result[2].id, rank: result[2].rank, suite: result[2].suite, img: result[2].image_link, back_img: result[2].back_image_link });
    playerHand.push({ id: result[3].id, rank: result[3].rank, suite: result[3].suite, img: result[3].image_link, back_img: result[3].back_image_link });

    dealerHand.push({ id: result[4].id, rank: result[4].rank, suite: result[4].suite, img: result[4].image_link, back_img: result[4].back_image_link });
    playerHand.push({ id: result[5].id, rank: result[5].rank, suite: result[5].suite, img: result[5].image_link, back_img: result[5].back_image_link });



    for (i = 0; i < 3; i++) {
      dealerCardRanks.push(parseInt(dealerHand[i].rank));
      dealerSuites.push(dealerHand[i].suite);

      playerCardRanks.push(parseInt(playerHand[i].rank));
      playerSuites.push(playerHand[i].suite);

    }

    antebet = parseInt(req.body.antebet);

    pairPlusBet = parseInt(req.body.pairplusbet);

    newUserTotal = (parseInt(req.body.pMoney) - pairPlusBet - antebet);

    // res.render('daves_stuff/choose_play', {
    var hobj = {
      pairbet: pairPlusBet,
      anteBet: antebet,
      playerHand: playerHand,
      dealerHand: dealerHand,
      users: { play_money: newUserTotal, id: parseInt(req.session.user_id)},
      bet: true,
      raise: false,
      fold: false,
      logged_in: req.session.logged_in
    };
    console.log('-------> ', hobj);
    res.render('cardgame', hobj);

  });

});

app.post('/playdecision/:id', function(req, res) {

  req.session.user_id = req.params.id;
  req.session.logged_in = true;

  // var condition = "id=" + req.params.id;
  // var queryString = 'SELECT * FROM users';
  // queryString = queryString + ' WHERE ';
  // queryString = queryString + condition;

  // console.log(queryString);

  // connection.query(queryString, function(data) {
  //   hbsObject = {
  //     users: data,
  //     logged_in: req.session.logged_in
  //   }
  //   console.log(hbsObject)
  //   return hbsObject;

  if (req.body.decision === "raise") {

  antebet = req.body.antebet;
  pairPlusBet = req.body.pairplusbet;

  bestPlayerHand = getBestHand(playerCardRanks, playerSuites);

  bestDealerHand = getBestHand(dealerCardRanks, dealerSuites);

  resultFromHand = getWinner(bestDealerHand, bestPlayerHand, antebet, pairPlusBet); //Money to add or deduct from current balance

  connection.query("SELECT * FROM users where id = ?", [req.params.id], function(err, result) {

    console.log("resultfromhand before updated query: " + resultFromHand);
    console.log('win or lose = ' + resultFromHand);

    var newBalance = parseInt(result[0].play_money) + resultFromHand;

    console.log('this is the new balance: ' + newBalance);
    console.log('from if!')
    console.log('this is res: ' + res);

    cashAdjust(result, newBalance);

    var playerHandTwo = playerHand;
    var dealerHandTwo = dealerHand;

    var showCards = {
      playerHand: playerHandTwo,
      dealerHand: dealerHandTwo,
      resultFromHand: resultFromHand
    };

    playerHand = [];
    dealerHand = [];
    dealerCardRanks = [];
    dealerSuites = [];
    playerCardRanks = [];
    playerSuites = [];

    // res.render('daves_stuff/showcards', showCards);
    // res.render('cardgame', {
    var hobj2 = {
      pairbet: 0,
      anteBet: 0,
      playerHand: playerHand,
      dealerHand: dealerHand,
      users: { play_money: newBalance, id: parseInt(req.session.user_id)},
      bet: true,
      raise: true,
      fold: false,
      // users: hbsObject.users,
      logged_in: req.session.logged_in
    };
    res.render('cardgame', hobj2);
  }); //END OF SQL QUERY TO GET PLAYER'S CURRENT BALANCE AND ADD/SUBTRACT BET DEPENDING ON WINNINGS

  } else if (req.body.decision === "fold") {
    connection.query("SELECT * FROM users where id = ?", [req.params.id], function(err, result) {

      newBalance = result[0].play_money - antebet - pairplusbet;

      console.log('fold new balance: ' + newBalance);

      cashAdjust(result, newBalance);
      //weird
      dealerHand = [];
      playerHand = [];
      dealerCardRanks = [];
      dealerSuites = [];
      playerCardRanks = [];
      playerSuites = [];

      var hobj2 = {
        pairbet: 0,
        anteBet: 0,
        playerHand: playerHand,
        dealerHand: dealerHand,
        users: { play_money: newBalance, id: parseInt(req.session.user_id)},
        bet: true,
        raise: false,
        fold: true,
        logged_in: req.session.logged_in
      };
      res.render('cardgame', hobj2);
    });

    function cashAdjust(res, value) {
      console.log('res=' + res);
      console.log('value= ' + value);
      connection.query("UPDATE users SET play_money = ? WHERE id = ?", [value, req.params.id], function(err, result) {
        //res.redirect('/');
        console.log('done updating from cashAdjust function')
      });
    };
  }; //End of POST /PLAYDECISION
});
//  }); //END OF SQL QUERY
// }); //END OF POST /ANTEBETS


BestHandInfo = function(nameOfHand, rankOfHand, highCard) {
  this.nameOfHand = nameOfHand,
    this.rankOfHand = rankOfHand,
    this.highToLow = highCard
}

function checkHighCard(rankArr) {

  rankArr = rankArr.sort(function(a, b) //sorts array in descending order
    {
      return b - a
    });

  var handInfo = new BestHandInfo("High Card", 1, [rankArr[0], rankArr[1], rankArr[2]]);

  return handInfo; // returns highest card in sorted array
};

function checkPair(rankArr) {
  rankArr = rankArr.sort(function(a, b){ //sorts array in descending order
      return b - a
    });
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
  rankArr = rankArr.sort(function(a, b){ //sorts array in descending order
      return b - a
    });
  if ((cardSuites[0] == cardSuites[1]) && (cardSuites[2] == cardSuites[1])) {
    var handInfo = new BestHandInfo("Flush", 3, [rankArr[0], rankArr[1], rankArr[2]]);
    return handInfo;
  } else {
    return false;
  };
};

function checkStraight(rankArr) {
  rankArr = rankArr.sort(function(a, b){//sorts array in descending order
      return b - a
    });
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
  rankArr = rankArr.sort(function(a, b){ //sorts array in descending order
      return b - a
  });
  if ((rankArr[0] == rankArr[1]) && (rankArr[2] == rankArr[1])) {
    var handInfo = new BestHandInfo("Three of a kind", 5, rankArr[0]);
    return handInfo;
  } else {
    return false;
  };
};

function getBestHand(rankArr, suiteArr) {
  if ((checkFlush(suiteArr, rankArr) != false) && ((checkStraight(rankArr) != false))) {
    var straightFlush = new BestHandInfo('Straight Flush', 6, rankArr[0]);
    return straightFlush;
  } else if (checkThreeKind(rankArr) != false) {
    return checkThreeKind(rankArr);
  } else if (checkStraight(rankArr) != false) {
    return checkStraight(rankArr);
  } else if (checkPair(rankArr) != false) {
    return checkPair(rankArr);
  } else {
    return checkHighCard(rankArr);
  }
};

function getWinner(dealer, player, antebet, pairplus) {
  console.log(dealer);
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

        plCard = Number(player.highToLow[c]);
        dlCard = Number(dealer.highToLow[c]);

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
      if ((Number(player.highPairCard)) > (Number(dealer.highPairCard))) {
        return payOuts('wins', player, antebet, pairplus);
      } else if ((Number(player.highPairCard)) < (Number(dealer.highPairCard))) {
        return payOuts('loss', player, antebet, pairplus);
      } else {
        if ((Number(player.kicker)) > (Number(dealer.kicker))) {
          return payOuts('wins', player, antebet, pairplus);
        } else if ((Number(player.kicker)) < (Number(dealer.kicker))) {
          return payOuts('loss', player, antebet, pairplus);
        } else { payOuts('push', player, antebet, pairplus); }

      }
    }
  } else if (dealer.rankOfHand > player.rankOfHand) {
    return payOuts('loss', player, antebet, pairplus);
  } else if (dealer.rankOfHand < player.rankOfHand) {
    return payOuts('wins', player, antebet, pairplus);
  };
};

function payOuts(playerHandOutcome, playerHand, antebet, pairPlus) {

  console.log("-------------betinfo------------------")
  console.log(playerHandOutcome);
  console.log('This is the players  hand rank ' + playerHand.rankOfHand);
  console.log('this is the players hand name' + playerHand.nameOfHand)
  console.log('antebet: ' + antebet);
  console.log('pairPlus bet: ' + pairPlus);

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
  console.log('amountwonorLOST-------');
  console.log(amountWonLost);
  return amountWonLost;

};

//---------------------------------LOGIC END-------------------------------------------------------
module.exports = checkThreeKind;

var port = process.env.PORT || 3000;
app.listen(port);


