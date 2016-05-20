//connects to the game_controllers.js --- deals with the hands for each user during the game

var orm = require('../config/orm.js');

var hand = {
	findOne: function(condition, cb) {
	  orm.findOne('deals_cards', condition, function(res){
	      cb(res);
	  });
  },
	all: function(cb) {
		orm.all('deals_cards', function(res){
			cb(res);
		});
	},
	//cols and vals are arrays
	create: function(cols, vals, cb) {
		orm.create('deals_cards', cols, vals, function(res){
			cb(res);
		});
	},
	update: function(objColVals, condition, cb) {
		orm.update('deals_cards', objColVals, condition, function(res){
			cb(res);
		});
	},
	delete: function(condition, cb){
		orm.delete('deals_cards', condition, function(res){
			cb(res);
		});
	}
};

module.exports = hand;