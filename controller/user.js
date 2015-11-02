var querystring = require('querystring');
var url = require('url');
var util = require('../myutil');
var cfg = require('../appcfg');
var methods = {};

module.exports = {
	handler : function(req, res, path) {
		var handle = methods[path];
		if(handle) {
			handle(req, res);
		}
		else {
			util.htmlError(404, {}, res);
		}
	}
}

methods['/user'] = function(req, res) {
	var name = null;
	var fbid = null;
	if(req.headers.cookie) {
		var cookies = req.headers.cookie.split(';');
		var token = null;
		var name = null;
		for(var i=0; i<cookies.length; i++) {
			if(cookies[i].indexOf("tok=") >= 0) {
				token = cookies[i];
				break;
			}
		}
		var c = token.split("/");
		if(c[2]) {
			name = c[1];
			var options = {
				hostname: cfg.baseUrl,
				port: cfg.port,
				path: '/api/users/' + c[2] + '?id=fb',
				method: 'GET'
			};
			util.getDataFromApi(options, function(err, data) {
				if(err) {
					console.log(JSON.stringify(err));
				}
				util.render(res, 'views/userinfo.html', { users : JSON.parse(data), name : name });
			});
		}
		else {
			util.htmlError(404, {}, res);
		}
	}
	else {
		util.htmlError(404, {}, res);
	}
}

console.log('Loaded user controller');