var util = require('../../myutil');
var methods = {};

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

methods['POST'] = function(req, res) {
	res.send(JSON.stringify({message : 'For implementation login'}));
}

methods['DELETE'] = function(req, res) {
	var url = req.url.split('/');
	if(url.length === 4) {
		if(url[3]) {
			res.send(JSON.stringify({message : 'For implementation logout. ' + url[3]}));
		}
		else {
			util.jsonError(205, 'Empty ID', res);
		}
	}
	else {
		util.jsonError(205, 'Empty ID', res);
	}
}

console.log('Loaded sessions API');