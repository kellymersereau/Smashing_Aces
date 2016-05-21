var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
var card = require('../models/card.js');
var user = require('../models/user.js');
var connection = require('../config/connection.js');

//(kelly) the problem with this is when we do the user log in the findOne is pulling the condition from this router instead of the login router and idk how to fix that

//this is the users_controller.js file
// router.get('/:id', function(req, res){
//   var user_id = req.params.id;
//   var condition = 'id = ' + user_id;
//   user.findOne(condition, function(user){
//       res.render('users/info', user);
//   });
// });

router.get('/new', function(req,res) {
	res.render('user/new');
});

router.get('/sign-in', function(req,res) {
	res.render('user/sign_in');
});

router.get('/sign-out', function(req,res) {
  req.session.destroy(function(err) {
     res.redirect('/')
  })
});

//if user trys to sign in with the wrong password or email tell them that on the page
router.post('/login', function(req, res) {
	// var email = req.body.email;

	var condition = "email = '" + req.body.email + "'";
	user.findOne(condition, function(err, users){
		if(err){
			res.send('an account with this email does not exist - please sign up');
		}
		if (users.length > 0){
			bcrypt.compare(req.body.password, users[0].password_hash, function(err, result) {
					if (result == true){

						req.session.logged_in = true;
						req.session.user_id = users[0].id;
						req.session.user_email = users[0].email;

						res.redirect('/user_info/:id');
					} else{
						res.redirect('/sign-in');
					}
			});
		}else{
			res.send('an account with this email does not exist - please sign up')
		}
	});
});

router.post('/create', function(req,res) {
	var queryString = "select * from users where email = '" + req.body.email + "'";

	connection.query(queryString, function(err, users) {
			if (err) throw err;

			if (users.length > 0){
				console.log(users)
				res.send('we already have an email or username for this account')
			}else{

				bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(req.body.password, salt, function(err, hash) {
              user.create(['username', 'email', 'password_hash'], [req.body.username, req.body.email, hash], function(data){
                
                req.session.logged_in = true;
                req.session.user_id = user.id;
                req.session.user_email = user.email;

                res.redirect('/sign-in')
            	});

						});
				});

			}
	});
});

module.exports = router;