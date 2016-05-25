var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  res.render('home');
});
router.get('/game', function(req, res) {
  res.render('cardgame');
});
module.exports = router;