var querystring = require('querystring');
var url = require('url');
var util = require('../../myutil');
var methods = {};
var model = {};

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
	res.send(JSON.stringify({message : 'For implementation reviews GET'}));
}

methods['POST'] = function(req, res) {
	res.send(JSON.stringify({message : 'For implementation reviews POST'}));
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
	
	res.send(JSON.stringify({message : 'For implementation reviews PUT. ' + url[3]}));
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

	res.send(JSON.stringify({message : 'For implementation reviews DELETE. ' + url[3]}));
}

console.log('Loaded reviews API');