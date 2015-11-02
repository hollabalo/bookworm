var url = require('url');
var util = require('../myutil');
var methods = {};

module.exports = {
	handler : function(req, res, path) {
		var u = url.parse(req.url, true);
		var handle = methods[u.pathname];
		if(handle) {
			handle(req, res);
		}
		else {
			util.htmlError(404, {}, res);
		}
	}
}

methods['/admin'] = function(req, res) {
	util.render(res, 'views/admin.html', {});
}

console.log('Loaded admin controller');