var querystring = require('querystring');
var u = require('url');
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

methods['/books'] = function(req, res) {
	var uu = u.parse(req.url, true);
	var url = uu.pathname.split('/');
	var name = null;
	if(req.headers.cookie) {
		var c = req.headers.cookie.split('/');
		if(c[1]) {
			name = c[1].split(';')[0];
		}
	}
	if(url.length === 3 && url[2]) {
		var options = {
		  hostname: cfg.baseurl,
		  port: cfg.port,
		  path: '/api/books/' + url[2],
		  method: 'GET'
		};
		util.getDataFromApi(options, function(err, data) {
			var bookinfo = JSON.parse(data);
			if(err) {
				util.htmlError(404, {}, res);
				return;
			}
			if(bookinfo.errCode) {
				util.htmlError(404, {}, res);
				return;
			}
			util.render(res, 'views/bookinfo.html', { bookinfo: bookinfo, name : name });
			var post = querystring.stringify({
				views : parseInt(bookinfo[0].views + 1)
			});
			var opts = {
				hostname: cfg.baseUrl,
				port: cfg.port,
				path: '/api/books/' + bookinfo[0]._id,
				method: 'PUT',
				headers: {
			        'Content-Type': 'application/x-www-form-urlencoded',
			        'Content-Length': Buffer.byteLength(post)
			    }
			};
			util.postDataToApi(opts, post, function(err, d) {
				// console.log(JSON.stringify(d))
			});
		});
	}
	else {
		var query = uu.query;
		var path = '/api/books';
		if(query.title) {
			query.title = query.title.replace(/ /g, '+');
			query.title = query.title.replace(/%20/g, '+');
			path += '?title=' + query.title;
		}
		else if(query.author) {
			query.author = query.author.replace(/ /g, '+');
			query.author = query.author.replace(/%20/g, '+');
			path += '?author=' + query.author;
		}
		var options = {
		  hostname: cfg.baseUrl,
		  port: cfg.port,
		  path: path,
		  method: 'GET'
		};
		util.getDataFromApi(options, function(err, data) {
			if(err) {
				console.log(err);
				util.htmlError(500, {}, res);
				return;
			}
			util.render(res, 'views/books.html', { books: JSON.parse(data), name : name });
		});
	}
}

console.log('Loaded book controller');