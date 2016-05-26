var express = require('express');
var router  = express.Router();
var connection = require('../config/connection.js');

router.get('/:id', function(req, res) {
	req.session.user_id = req.params.id;
  var users = {
  	id: req.session.user_id
  }
  res.render('home', users);
});

// router.get('/game/:id', function(req,res){
// 	var users = {
// 		id: req.session.user_id
// 	}
// 	res.render('cardgame', users);
// })

module.exports = router;