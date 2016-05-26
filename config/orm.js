/*
Here is the O.R.M. where you write functions that takes inputs and conditions and turn them into database commands like SQL.
*/
var connection = require('../config/connection.js');

function printQuestionMarks(num){
  var arr = [];

  for (var i=0; i<num; i++){
    arr.push('?')
  }

  return arr.toString();
}

function objToSql(ob){
  //column1=value, column2=value2,...
  var arr = [];

  for (var key in ob) {
    arr.push(key + '=' + ob[key]);
  }

  return arr.toString();
}
//these orm functions and querystrings will need to be changed to match the format of our databases and the queries we will need to run.
var orm = {
    findOne: function(tableInput, condition, cb) {
        var queryString = 'SELECT * FROM ' + tableInput;
        queryString = queryString + ' WHERE ';
        queryString = queryString + condition;
        console.log(queryString);
        connection.query(queryString, function(err, result) {
            // if (err) throw err;
            if(err) throw err;
            cb(result);
        });
    },
    all: function(tableInput, cb) {
        var queryString = 'SELECT * FROM ' + tableInput + ';';
        connection.query(queryString, function(err, result) {
            if (err) throw err;
            cb(result);
        });
    },
    //vals is an array of values that we want to save to cols
    //cols are the columns we want to insert the values into
    create: function(table, cols, vals, cb) {
      var queryString = 'INSERT INTO ' + table;

      queryString = queryString + ' (';
      queryString = queryString + cols.toString();
      queryString = queryString + ') ';
      queryString = queryString + 'VALUES (';
      queryString = queryString + printQuestionMarks(vals.length);
      queryString = queryString + ') ';

      console.log(queryString)

      connection.query(queryString, vals, function(err, result) {
        if (err) throw err;
        cb(result);
      });
    },
    //objColVals would be the columns and values that you want to update
    //an example of objColVals would be {name: panther, sleepy: true}
    update: function(table, objColVals, condition, cb) {
      var queryString = 'UPDATE ' + table;

      queryString = queryString + ' SET ';
      queryString = queryString + objToSql(objColVals);
      queryString = queryString + ' WHERE ';
      queryString = queryString + condition;

      console.log(queryString)
      connection.query(queryString, function(err, result) {
        if (err) throw err;
        cb(result);
      });
    },
    delete: function(table, condition, cb){
      //not sure if below code is needed or correct. will revist maybe one day
      // req.session.username = req.params.username;
      // req.session.id = req.params.id;
      // var condition = 'id' + req.params.id;
      //   console.log(condition);
      var queryString = 'DELETE FROM users';
      queryString = queryString + ' WHERE ';
      queryString = queryString + condition;

      connection.query(queryString, function(err, result) {
        if (err) throw err;
        cb(result);
      });
    }
};

module.exports = orm;