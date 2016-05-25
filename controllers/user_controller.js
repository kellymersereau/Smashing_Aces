var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
var card = require('../models/card.js');
var user = require('../models/user.js');
var connection = require('../config/connection.js');
// var session = require('session');
//(kelly) the problem with this is when we do the user log in the findOne is pulling the condition from this router instead of the login router and idk how to fix that

//this is the users_controller.js file
// router.get('/profile/:id', function(req, res){

// 	var queryString = "select * from users "
// 	queryString += 

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

router.get('/profile/:id', function(req,res) {
	// res.render('user/user_info');
	// console.log(req.session.cookie);
	//find user by req.session.cookie
	//within a cb after user found, then res.render
	// req.session.username = req.params.username; //use this
	console.log('req.session is ', req.session);
	console.log('req.session.id is ', req.session.id);
	req.session.id = req.params.id; //use this
	console.log('req.session.id is ', req.session.id);
	console.log('req.params.id is ', req.params.id);

	var condition = "id=" + req.params.id; //use this
	console.log('profile route condition ', condition);
	console.log('profile route req.session ', req.session);
	// var condition = "id=" + req.params.id;
	user.findOne(condition, function(result){
		console.log('this is the result', result[0].id);
		res.render('user/user_info', {users: result[0]})
	}) ;
	// res.render('user/user_info', {});
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
  });
});



//if user trys to sign in with the wrong password or email tell them that on the page
router.post('/login', function(req, res) {
	var email = req.body.email;

	var condition = "email='" + req.body.email + "';";

	user.findOne(condition, function(user){
		// console.log("we found this, ", user);
		// if(err){
		// 	res.send('an account with this email does not exist - please sign up');
		// }
		if (user){

			bcrypt.compare(req.body.password, user[0].password_hash, function(err, result) {
					if (result == true){
						console.log(req.session);
						req.session.logged_in = true;
						req.session.user_id = user[0].id;
						req.session.user_email = user[0].email;
						console.log(req.session)
						res.redirect('/user/profile/' + req.session.user_id);
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
				// console.log(users)
				res.send('we already have an email or username for this account');
			}else{

				bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(req.body.password, salt, function(err, hash) {
              user.create(['username', 'email', 'password_hash', 'photo'], [req.body.username, req.body.email, hash, req.body.photo], function(data){
                
                req.session.logged_in = true;
                req.session.user_id = users.id;
                req.session.user_email = users.email;
                // res.render('user/sign-in')
                res.redirect('/');
            	});
// 
						});
				});

			}
	});
});

router.put('/update', function(req, res){
	var condition = "id = " + req.params.id;

	user.update({'email': req.body.email}, condition, function(req, res){
		res.send('E-mail updated!');
	});
});

router.put('/addMoney', function(req, res){
	var condition = "id = " + req.params.id;

	user.findOne(condition, function(req, res){
		newMoney = parseInt(res.play_money) + parseInt(req.body.playMoney);
		console.log(newMoney);
	});

	user.update({'play_money': playMoney}, condition, function(req, res){
		res.send('Money added to account!');
	});
});

router.get('/potato', function(req,res) {
	console.log('hitting this')
	// console.log('trying to delete ', req.body.id);
	// console.log('trying to delete params', req.params.id);
	
	// if (req.session.id == req.params.id){ //use this
	// var condition = "id=" + req.body.name; //use this
	// console.log('delete condition', condition);
	// var condition = "id=" + req.params.id;
	// var condition = 'id = ' + req.params.id;
	// req.session.user_id = user[0].id;
	// var condition = 'id = ' + req.body.id;

	// user.delete(req.body.name, function(data){
	// 	res.redirect('/');
	// });
	res.send(200)
});
module.exports = router;

// router.delete('/delete/:id', function(req,res) {
// 	res.send('')
// 	console.log('trying to delete ', req.body.id);
// 	console.log('trying to delete params', req.params.id);
// 	var condition = 'id = ' + req.params.id;
// 	// req.session.user_id = user[0].id;
// 	// var condition = 'id = ' + req.body.id;

// 	user.delete(condition, function(data){
// 		res.redirect('/');
// 	});
// });