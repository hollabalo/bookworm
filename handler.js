var http = require('http');
var util = require('./myutil');
var url = require('url');
module.exports = function() {
	var urls = [];
	var v = {};
	v.handlers = {};
	v.get = function(path, handler) {
		v.handlers[path] = {
			handler : handler,
			path : path 
		};
	}
	v.listen = function(port) {
		server = http.createServer(function(req, res) {
			res.send = function(text) {
				res.writeHead(200, { 'Content-Type' : 'application/json'});
				res.end(text);
			};
			res.html = function(html) {
				res.writeHead(200, { 'Content-Type' : 'text/html'});
				res.end(html);
			};
			var handler = null
			var path = '';
			var s = url.parse(req.url, true);
			for(var k in urls) {
				if(s.pathname.indexOf(urls[k]) === 0) {
					handler = v.handlers[urls[k]].handler;
					path = v.handlers[urls[k]].path;
					break;
				}
				else if(s.pathname === '/') {
					handler = v.handlers['//'].handler;
					path = v.handlers['//'].path;
					break;
				}
			}
			if(handler) {
				handler(req, res, path);
			}
			else {
				if(req.url.indexOf('/api/') === 0 ||
					req.url.indexOf('/api') === 0 ) {
					util.jsonError(404, 'Endpoint undefined', res);
				}
				else {
					util.loadResources(req, res);
				}
			}
		}).listen(port);
	};
	v.urls = function(u) {
		urls = u;
	}
	return(v);
}