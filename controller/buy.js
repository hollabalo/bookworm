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

methods['/buy'] = function(req, res) {
	var uu = url.parse(req.url, true);
	var args = uu.pathname.split('/');
	if(!args[2]) {
		res.send(JSON.stringify({ errCode : '500', message : 'Cannot get credit card information'}))
		return;
	}
	if(!args[3]) {
		res.send(JSON.stringify({ errCode : '500', message : 'Cannot get book price information'}))
		return;
	}
	if(req.method != 'POST') {
		res.send(JSON.stringify({ errCode : '500', message : 'Operation not permitted'}))
		return;
	}
	var opts = {
		hostname: cfg.baseUrl,
		port: cfg.port,
		path:  '/api/users/' + args[2] + '?id=fb',
		method: 'GET'
	};
	util.getDataFromApi(opts, function(err, data) {
		if(err) {
			res.send(JSON.stringify({ errCode : '500', message : 'Error'}))
			return;
		}
		var info = JSON.parse(data);
		var post = JSON.stringify({
			cardnumber: info[0].creditcard,
			amount: parseInt(args[3])
		});
		console.log(post)
		opts = {
			hostname: cfg.paymentBaseUrl,
			port: cfg.paymentPort,
			path: cfg.paymentEndpoint + 'transactions',
			method: 'POST',
			headers: {
		        'Content-Type': 'application/json',
		        'Content-Length': Buffer.byteLength(post)
		    }
		};
		util.postDataToApi(opts, post, function(err, d) {
			if(err) {
				res.send(JSON.stringify({ resCode : '500', message : err.message}))
				return;
			}
			console.log(JSON.stringify(d))
			res.send(JSON.stringify({ resCode : '200', message : 'Success'}))
		});
	});	
}

console.log('Loaded payment controller');