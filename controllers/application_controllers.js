var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
	console.log('--------------');
	console.log('home route session check: ', req.session);
	console.log(req.session.user_id);
	var users = {
		id: req.session.user_id
	}
  res.render('home', users);
});

module.exports = router;