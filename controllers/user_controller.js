var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
var card = require('../models/cards.js');
var user = require('../models/user.js');
var connection = require('../config/connection.js');

router.get('/game/:id', function(req,res) {
	console.log('this is req.session.id ' + req.session.id);
	console.log('this is req.session.logged_in ' + req.session.logged_in);
	req.session.id = req.params.id;
	var condition = "id=" + req.params.id;

	user.findOne(condition, function(data){
		var hbsObject = {
			users: data[0],
			logged_in: req.session.logged_in
		}
		console.log(hbsObject)
		res.render('cardgame', hbsObject);
	});
});




router.get('/new', function(req,res) {
	res.render('user/new');
});

router.get('/sign-in', function(req,res) {
	res.render('user/sign_in');
});

router.get('/profile/:id?', function(req,res) {
	console.log('req.session is ', req.session);
	console.log('req.session.id is ', req.session.user_id);

	// this is used to attach the user session to the profile page. 

if(req.session.user_id){
	req.params.id = req.session.user_id;	
}
//	req.session.id = req.params.id; //use this
	console.log('req.params.id is ', req.params.id);
	// I used req.params.id from above to set the condition in order for the findAll orm function to work properly.
	var condition = "id=" + req.params.id; //use this
	console.log('profile route condition ', condition);
	// var condition = "id=" + req.params.id;
	user.findOne(condition, function(result){
		var hbsObject = {
			users: result[0],
			logged_in: req.session.logged_in,
		}
		console.log('this is the result', result[0].id);
		//using the users key with result[0] properly renders the user info onto the handlebars profile page.
		res.render('user/user_info', {users: result[0]}) 
	}) ;
});

router.get('/home/:id', function(req,res) {

	console.log('home req.session is ', req.session);
	console.log('home req.session.id is ', req.session.user_id);

	// this is used to attach the user session to the profile page. 
	req.session.id = req.params.id; //use this

	var condition = "id=" + req.params.id; //use this
	// var condition = "id=" + req.params.id;
	user.findOne(condition, function(result){
		var hbsObject = {
			users: result[0],
			logged_in: req.session.logged_in
		}
		console.log(hbsObject)
		res.render('home', hbsObject);
	}) ;
});

router.get('/update/:id', function(req, res){
	res.redirect('/update');
});

router.get('/addMoney/:id', function(req, res){
	res.redirect('/addMoney');
});

router.get('/sign-out', function(req,res) {
  req.session.destroy(function(err) {
     res.redirect('/')
  })
});

//if user trys to sign in with the wrong password or email tell them that on the page
router.post('/login', function(req, res) {
	var email = req.body.email;
	console.log('req.body.email is', req.body.email);
	var condition = "email='" + req.body.email + "';";

	user.findOne(condition, function(user){

		console.log('-------');
		console.log(user);
		console.log('-------');

		if(user) {

		  bcrypt.compare(req.body.password, user[0].password_hash, function(err, result) {
		      if (result == true){
		        console.log('bycrypt message ', req.session);
		        req.session.logged_in = true;
		        req.session.user_id = user[0].id;
		        req.session.user_email = user[0].email;
		        console.log(req.session)
		        res.redirect('/user/profile/' + req.session.user_id);
		      } else{
		      	console.log('wrong password')
		        res.redirect('/');
		      }
		  });
		}else{
			res.send('an account with this email does not exist - please sign up!')
		}
	});
});

router.post('/create', function(req,res) {
	var queryString = "SELECT * FROM users WHERE email = '" + req.body.email + "'";

	connection.query(queryString, function(err, users) {
			if (err) throw err;

			if (users.length > 0){
				// console.log(users)
				res.send('we already have an email or username for this account')
			}else{

				bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(req.body.password, salt, function(err, hash) {
              user.create(['username', 'email', 'password_hash', 'photo'], [req.body.username, req.body.email, hash, req.body.photo], function(data){
                req.session.logged_in = true;
                req.session.user_id = user.id;
                req.session.user_email = user.email;
                console.log('usercreated');
                res.redirect('/')
            	});

						});
				});

			}
	});
});

// router.put('/update', function(req, res){
// 	var condition = "id = " + req.params.id;

// 	user.update({'email': req.body.email}, condition, function(req, res){
// 		res.send('E-mail updated!');
// 	});
// });

router.put('/update/:id', function(req, res){
	var condition = "id=" + req.params.id;

	console.log('--------------');
	console.log('addMoney route put condition', condition);
	console.log(req.body.play_money)
	
	var sum = 0;
	var player = {};
	
	var queryString = 'SELECT play_money FROM users WHERE ' + condition;
	console.log('queryString', queryString);
	
	connection.query(queryString, function(err, result) {
			if (err) throw err;
			console.log('result: ', parseInt(result[0].play_money));
			player = result;
			sum = parseInt(result[0].play_money) + parseInt(req.body.play_money);
			console.log('update with this value ', sum);
			var queryString2= 'UPDATE users SET play_money=' + sum + ' WHERE ' + condition;
			console.log(queryString2);
			
			connection.query(queryString2, function(err, result) { 	
				res.redirect('/user/profile/' + req.params.id);
			});
	});

});

router.delete('/delete/:id', function(req,res) {
	var condition = 'id = ' + req.params.id;

	user.delete(condition, function(data){
		res.redirect('/');
	});
});
module.exports = router;