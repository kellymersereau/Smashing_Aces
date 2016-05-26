var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {

  var users = {
  	id: req.session.user_id
  }
  res.render('home', users);
});

router.get('/game', function(req, res) {
	var users = {
		id: req.session.user_id
	}
  res.render('cardgame', users);
});
module.exports = router;