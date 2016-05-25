var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');

var app = express();

//Serve static content for the app from the "public" directory in the application directory.
//middleware gets used first, order is important.
app.use(logger('dev'));
app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge: 24*60*60*1000}
}));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');


var application_controllers = require('./controllers/application_controllers.js');
var cards_controller = require('./controllers/cards_controller.js');
var user_controller = require('./controllers/user_controller.js');
var game_controller = require('./controllers/game_controller.js');

app.use('/', application_controllers);
app.use('/cards', cards_controller);
app.use('/user', user_controller);
app.use('/game', game_controller);

var port = process.env.PORT || 3000;
app.listen(port);