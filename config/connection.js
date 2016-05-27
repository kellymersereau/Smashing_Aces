/*
Here is where you make the connection to the database and export and used by the O.R.M.
*/
var mysql = require('mysql');
var connection = mysql.createConnection({
    // port: 3000,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'cards_db'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

var sess;

module.exports = connection;