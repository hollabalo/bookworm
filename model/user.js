var db = require('./db.js');

var schema = {
	fbId : String,
	name : String,
	username : String,
	password : String,
	creditcard : String
};

var User = db.con.model('User', schema);

module.exports = {
	model : User,
	get : function(obj, callback) {
		get(obj, callback);
	},
	add : function(obj, callback) {
		add(obj, callback);
	},
	update : function(id, obj, callback) {
		update(id, obj, callback);
	},
	del : function(id, callback) {
		del(id, callback);
	}
}

function get(obj, callback) {
	User.find(obj, function(err, doc) {
		if(err) {
			callback(err);
			return;
		}
		callback(null, doc);
	})
}

function add(obj, callback) {
	obj.save(function(err, doc) {
		if(err) {
			callback(err);
			return;
		}
		callback(null, doc);
	})
}

function update(id, obj, callback) {
	User.findByIdAndUpdate(id, obj, function(err, doc) {
		if(err) {
			callback(err);
			return;
		}
		callback(null,doc);
	});
}

function del(obj, callback) {
	User.remove(obj, function(err) {
		if(err) {
			callback(err);
			return;
		}
		callback();
	});
}

console.log('Loaded user data access');