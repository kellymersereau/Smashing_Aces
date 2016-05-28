var express = require('express');
var router  = express.Router();
var connection = require('../config/connection.js');

router.get('/', function(req, res) {

	if (req.session.user_id){
		connection.query("SELECT * FROM users where id = ?", [req.session.user_id], function(err, result) {	    
		    var users = {
		    	users: {id: req.session.user_id, play_money: result[0].play_money},
		    	logged_in: req.session.logged_in,
		    }
		    res.render('home', users);
		});
	}else{
		res.render('home');
	}

});

module.exports = router;
