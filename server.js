var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var connection = require('./config/connection.js');
var pokerFunctions = require('./lib/pokerlogic.js');

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


var dealerHand = [];
var playerHand = [];
var dealerCardRanks = [];
var dealerSuites = [];
var playerCardRanks = [];
var playerSuites = [];
var hbsObject = {};


app.post('/antebets/:id?', function(req, res) {
    if (req.session.user_id) {
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
            showBackOfDealerCards: true,
            showFrontOfDealerCards: false,
            pairbet: pairPlusBet,
            anteBet: antebet,
            playerHand: playerHand,
            dealerHand: dealerHand,
            users: { play_money: newUserTotal, id: parseInt(req.session.user_id) },
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

    if (req.body.decision === "raise") {

        antebet = req.body.antebet;
        pairPlusBet = req.body.pairplusbet;

        bestPlayerHand = pokerFunctions.getBestHand(playerCardRanks, playerSuites);

        bestDealerHand = pokerFunctions.getBestHand(dealerCardRanks, dealerSuites);

        resultFromHand = pokerFunctions.getWinner(bestDealerHand, bestPlayerHand, antebet, pairPlusBet); //Money to add or deduct from current balance

        connection.query("SELECT * FROM users where id = ?", [req.params.id], function(err, result) {


            console.log("resultfromhand before updated query: " + resultFromHand);
            console.log('win or lose = ' + resultFromHand);

            var newBalance = parseInt(result[0].play_money) + resultFromHand;
            console.log("previous balance", result[0]);
            console.log('this is the new balance: ' + newBalance);
           

            cashAdjust(result, newBalance);

            var playerHandTwo = playerHand;
            var dealerHandTwo = dealerHand;

            // var showCards = {
            //     playerHand: playerHandTwo,
            //     dealerHand: dealerHandTwo,
            //     resultFromHand: resultFromHand
            // };

            win = false;
            loss = false;
            push = false;

            if (resultFromHand == 0){
                push = true;
            }
            else if (resultFromHand > 0){
                win = resultFromHand;
            }else {
                loss = -1 * (resultFromHand);
            }
            
            var hobj2 = {
                push:push,
                win: win,
                loss: loss,
                afterraisefold: true,
                showBackOfDealerCards: false,
                showFrontOfDealerCards: true,
                bet: true,
                pairbet: 0,
                anteBet: 0,
                playerHand: playerHand,
                dealerHand: dealerHand,
                users: { play_money: newBalance, id: parseInt(req.session.user_id) },
                raise: true,
                fold: false,
                // users: hbsObject.users,
                logged_in: req.session.logged_in
            };

            playerHand = [];
            dealerHand = [];
            dealerCardRanks = [];
            dealerSuites = [];
            playerCardRanks = [];
            playerSuites = [];

            //res.send(hobj2);
            
            res.render('cardgame', hobj2);
        }); //END OF SQL QUERY TO GET PLAYER'S CURRENT BALANCE AND ADD/SUBTRACT BET DEPENDING ON WINNINGS

    } else if (req.body.decision === "fold") {
        connection.query("SELECT * FROM users where id = ?", [req.params.id], function(err, result) {

            antebet = parseInt(req.body.antebet);
            pairPlusBet = parseInt(req.body.pairplusbet);

            newBalance = parseInt(result[0].play_money) - antebet - pairPlusBet;

            console.log('fold new balance: ' + newBalance);

            cashAdjust(result, newBalance);

            var hobj2 = {
                // push:push,
                // win: win,
                // loss: loss,
                afterraisefold: true,
                showBackOfDealerCards: false,
                showFrontOfDealerCards: true,
                bet: true,
                pairbet: 0,
                anteBet: 0,
                playerHand: playerHand,
                dealerHand: dealerHand,
                users: { play_money: newBalance, id: parseInt(req.session.user_id) },
                raise: true,
                fold: false,
                // users: hbsObject.users,
                logged_in: req.session.logged_in
            };
            //res.send(hobj2);

            //weird
            dealerHand = [];
            playerHand = [];
            dealerCardRanks = [];
            dealerSuites = [];
            playerCardRanks = [];
            playerSuites = [];

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


var port = process.env.PORT || 3000;
app.listen(port);
