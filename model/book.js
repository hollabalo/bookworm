var db = require('./db.js');

var schema = {
	title : String,
	author : String,
	picture : String,
	description : String,
	downloadLink : String,
	price : Number,
	views : Number
};

var Book = db.con.model('Book', schema);

module.exports = {
	model : Book,
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
	Book.find(obj, function(err, doc) {
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
	Book.findByIdAndUpdate(id, obj, function(err, doc) {
		if(err) {
			callback(err);
			return;
		}
		callback(null, doc);
	});
}

function del(obj, callback) {
	Book.remove(obj, function(err) {
		if(err) {
			callback(err);
			return;
		}
		callback();
	});
}

console.log('Loaded book data access');