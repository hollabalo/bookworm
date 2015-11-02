var http = require('http');
var https = require('https');
var con = require('consolidate');
var fs = require('fs');
var u = require('url');

module.exports = {
	jsonError : function(errCode, msg, res) {
		res.send(JSON.stringify({
			errCode : errCode,
			message : msg
		}));
	},
	htmlError : function(errCode, args, res) {
		render(res, './views/errors/' + errCode + '.html', {});
	},
	render : function(res, template, args) {
		render(res, template, args)
	},
	postDataToApi : function(options, post, callback) {
		postDataToApi(options, post, callback);
	},
	getDataFromApi : function(options, callback) {
		getDataFromApi(options, callback);
	},
	getDataFromApiHttps : function(options, callback) {
		getDataFromApiHttps(options, callback);
	},
	loadResources : function(req, res) {
		loadResources(req, res);
	}
}

function render(res, template, args) {
	con.swig('./' + template, args,
		function(err, html) {
			res.html(html);
		}
	)
}

function postDataToApi(options, post, callback) {
	var chunk = '';
	var req = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(d) {
			chunk += d;
		});
		res.on('end', function() {
			callback(null, chunk);
		});
	});
	req.on('error', function(e) {
		callback(e);
	});
	req.write(post);
	req.end();
}

function getDataFromApi(options, callback) {
	var str = '';
	var req = http.request(options, function(res) {
		res.on('data', function(d) {
			str += d.toString();
		});
		res.on('end', function() {
			callback(null, str);
		});
	});
	req.on('error', function(e) {
		callback(e);
	})
	req.end();
}

function getDataFromApiHttps(options, callback) {
	var str = '';
	var req = https.request(options, function(res) {
		res.on('data', function(d) {
			str += d.toString();
		});
		res.on('end', function() {
			callback(null, str);
		});
	});
	req.on('error', function(e) {
		callback(e);
	})
	req.end();
}

function loadResources(req, res) {
	var url = u.parse(req.url, true).pathname.split('/');
	var resource = url[url.length - 1];
	var x = resource.split('.');
	var ext = x[x.length - 1];
	if(headers[ext]) {
		fs.readFile('./assets/' + ext + '/' + resource, function(err, data) {
			if(!data) {
				res.writeHead(404, {'Content-Type' : headers['plain']});
				res.end();
				return;
			}
			res.writeHead(200, {'Content-Type' : headers[ext]});
			res.end(data);
		});
	}
	else {
		render(res, './views/errors/404.html', {});
	}
}

var headers = {
	html : 'text/html',
	js : 'application/javascript',
	css : 'text/css',
	plain : 'text/plain'
}