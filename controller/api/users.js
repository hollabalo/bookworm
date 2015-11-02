var querystring = require('querystring');
var u = require('url');
var util = require('../../myutil');
var methods = {};
var model = {};
model['user'] = require('../../model/user');
var User = model['user'].model;

module.exports = {
	handler : function(req, res) {
		var handle = methods[req.method];
		if(handle) {
			handle(req, res);
		}
		else {
			util.jsonError(404, 'Not found', res);
		}
	}
}

methods['GET'] = function(req, res) {
	var q = u.parse(req.url, true).query;
	var url = req.url.split('/');
	var query = {};
	if(url.length === 4) {
		var id = url[3].split('?')[0];
		if(id) {
			if(q.id === 'fb') {
				query = {'fbId' : id};
			}
			else {
				query = {'_id' : id};
			}
		}
	}
	model['user'].get(query, function(err, doc) {
		if(err) {
			util.jsonError('500', 'Find error', res);
			return;
		}
		res.send(JSON.stringify(doc));
	});
}

methods['POST'] = function(req, res) {
	var q = u.parse(req.url, true).query;
    var chunk = '';
    req.on('data', function (data) {
        chunk += data;
    });
    req.on('end', function () {
        var c = querystring.parse(chunk);
        var query;
        if(q.type === 'login') {
        	query = {
        		'username' : c.username
        		,'password' : c.password
        	};

			model['user'].get(query, function(err, doc) {
				if(err) {
					util.jsonError('500', 'Find error', res);
					return;
				}
				res.send(JSON.stringify(doc));
			});
        }
        else {
	        if(c.username && c.password) {
	        	query = new User({
		        	fbId : c.fbId,
		        	name : c.name,
		        	username : c.username,
		        	password : c.password
		        });
	        }
	        else {
	        	query = new User({
		        	fbId : c.fbId,
		        	name : c.name,
		        	creditcard : ''
		        });
	        }
	        model['user'].add(query, function(err, doc) {
	        	if(err) {
	        		util.jsonError(300, 'Database error', res);
	        		return;
	        	}
	        	res.send(JSON.stringify({
	        		resCode: 200,
	        		message : 'Success',
	        		id: doc._id.toString()
	        	}));
	        });
        }
    });
}

methods['PUT'] = function(req, res) {
	var url = req.url.split('/');
	if(url.length != 4) {
		util.jsonError(205, 'Empty ID', res);
		return;
	}
	var id = url[3].split('?')[0];
	if(!id) {
		util.jsonError(205, 'Empty ID', res);
		return;
	}
	var chunk = '';
    req.on('data', function (data) {
        chunk += data;
    });
    req.on('end', function() {
		var c = querystring.parse(chunk);
        model['user'].update(url[3], { $set : c }, function(err, doc) {
        	if(err) {
        		util.jsonError(300, 'Database error', res);
        		return;
        	}
        	if(doc) {
				res.send(JSON.stringify({
	        		resCode: 200,
	        		message : 'Success',
	        		id: doc._id.toString()
	        	}));
        	}
        	else {
        		util.jsonError(205, 'Invalid ID', res);
        	}
        });
	});
}

console.log('Loaded users API');