//this deals with the cards that are dealt during the hands and the logic of the game itself

var orm = require('../config/orm.js');

var card = {
	findOne: function(condition, cb) {
	  orm.findOne('cards', condition, function(res){
	      cb(res);
	  });
  },
	all: function(cb) {
		orm.all('cards', function(res){
			cb(res);
		});
	},
	//cols and vals are arrays
	create: function(cols, vals, cb) {
		orm.create('cards', cols, vals, function(res){
			cb(res);
		});
	},
	update: function(objColVals, condition, cb) {
		orm.update('cards', objColVals, condition, function(res){
			cb(res);
		});
	},
	delete: function(condition, cb){
		orm.delete('cards', condition, function(res){
			cb(res);
		});
	}
};

module.exports = card;