var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')

var app = express();

//allow sessions
app.use(session({ secret: 'app', cookie: { maxAge: 60000 }}));
app.use(cookieParser());

//Serve static content for the app from the "public" directory in the application directory.
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

var application_controller = require('./controllers/application_controller.js');
var cats_controller = require('./controllers/cats_controller.js');
var users_controller = require('./controllers/users_controller.js');

app.use('/', application_controller);
app.use('/cats', cats_controller);
app.use('/users', users_controller);

var port = 3000;
app.listen(port);

// var mysql      = require('mysql');
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'cards_db'
// });

// connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   };

//   console.log('connected as id ' + connection.threadId);
// })

// //this is server.js
// app.get('/', function(req,res) {
//   res.render('home');
// });