var querystring = require('querystring');
var u = require('url');
var util = require('../../myutil');
var methods = {};
var model = {};
model['book'] = require('../../model/book');
var Book = model['book'].model;

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
	var uu = u.parse(req.url, true);
	var url = uu.pathname.split('/');
	var query = {};
	if(url.length === 5 && url[url.length-1]) {
		res.send(JSON.stringify('gs'))
	}
	else if(url.length === 4) {
		if(url[3]) {
			query = {'_id' : url[3]};
		}
	}
	else {
		if(uu.query.title) {
			query = { 'title' : {'$regex' : uu.query.title, '$options' : 'i'}};
		}
		else if(uu.query.author) {
			query = { 'author' : {'$regex' : uu.query.author, '$options' : 'i'}};
		}
	}
	model['book'].get(query, function(err, doc) {
		if(err) {
			util.jsonError(300, 'Database error', res);
			return;
		}
		res.send(JSON.stringify(doc));
	});
}

methods['POST'] = function(req, res) {
    var chunk = '';
    req.on('data', function (data) {
        chunk += data;
    });
    req.on('end', function () {
        var c = querystring.parse(chunk);
        var query = new Book({
        	title : c.title,
        	author : c.author,
        	picture : c.picture,
        	description : c.description,
        	downloadLink : c.downloadLink,
        	price : c.price,
        	views: c.views
        });
        model['book'].add(query, function(err, doc) {
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
    });
}

methods['PUT'] = function(req, res) {
	var url = req.url.split('/');
	if(url.length != 4) {
		util.jsonError(205, 'Empty ID', res);
		return;
	}
	if(!url[3]) {
		util.jsonError(205, 'Empty ID', res);
		return;
	}
    var chunk = '';
    req.on('data', function (data) {
        chunk += data;
    });
	req.on('end', function() {
		var c = querystring.parse(chunk);
        model['book'].update(url[3], { $set : c }, function(err, doc) {
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

methods['DELETE'] = function(req, res) {
	var url = req.url.split('/');
	if(url.length != 4) {
		util.jsonError(205, 'Empty ID', res);
		return;
	}
	if(!url[3]) {
		util.jsonError(205, 'Empty ID', res);
		return;
	}
	model['book'].del({ _id : url[3]}, function(err) {
		if(err) {
			util.jsonError(300, 'Database error', res);
			return;
		}
		res.send(JSON.stringify({
			resCode: 200,
    		message : 'Success'
		}));
	});
}

console.log('Loaded book API');