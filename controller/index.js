var querystring = require('querystring');
var util = require('../myutil');
var url = require('url');
var cfg = require('../appcfg');
var methods = {};
var OAuth= require('oauth').OAuth;
var secret = {};

var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"chg2QhKIuQpazjQnV7AetUR89",
	"HCH1WV3BHNDrwXtM7USZUdVHzA89bRcDgeh8m4Y2OvNY4WKUM9",
	"1.0",
	"http://www.localhost:8001?twitterok=true",
	"HMAC-SHA1"
);

module.exports = {
	handler : function(req, res, path) {
		var u = url.parse(req.url, true);
		var handle = methods['/' + u.pathname];
		if(handle) {
			handle(req, res);
		}
		else {
			util.htmlError(404, {}, res);
		}
	}
}

methods['//'] = function(req, res) {
	var u = url.parse(req.url, true);
	var name = null;
	if(req.headers.cookie) {
		var c = req.headers.cookie.split('/');
		if(c[1]) {
			name = c[1].split(';')[0];
		}
	}
	if(u.query.code) {
		var opts = {
		  hostname: 'graph.facebook.com',
		  port: 443,
		  path: '/oauth/access_token?client_id=868867163197113&' +
		        'redirect_uri=http://' + cfg.baseUrl +':' + cfg.port + '/' + 
		        '&client_secret=319e93798d6b43e3066bd132436023e1&code=' + u.query.code,
		  method: 'GET'
		};
		util.getDataFromApiHttps(opts, function(err, data) {
			if(err) {
				util.htmlError(404, {}, res);
				return;
			}
			var tok = data.split('=')[1].split('&expires')[0];
			opts = {
			  hostname: 'graph.facebook.com',
			  port: 443,
			  path: '/me?access_token=' + tok,
			  method: 'GET'
			};
			util.getDataFromApiHttps(opts, function(e, d) {
				if(e) {
					util.htmlError(404, {}, res);
					return;
				}
				var fbData = JSON.parse(d);
				var cookie = 'tok=' + tok + '/' + fbData.name + '/' + fbData.id;
				opts = {
				  hostname: cfg.baseUrl,
				  port: cfg.port,
				  path: '/api/users/' + fbData.id + '?id=fb',
				  method: 'GET'
				};
				util.getDataFromApi(opts, function(ee, user) {
					if(ee) {
						util.htmlError(500, {}, res);
						return;
					}
					if(JSON.parse(user).length === 0) {
						var post = querystring.stringify({
							fbId: fbData.id,
							name: fbData.name
						});
						opts = {
							hostname: cfg.baseUrl,
							port: cfg.port,
							path: '/api/users',
							method: 'POST',
							headers : {
								'Content-Type' : 'application/x-www-form-urlencoded',
								'Content-Length' : Buffer.byteLength(post)
							}
						};
						util.postDataToApi(opts, post, function(eu, ed) {
							console.log('USER IS NEW')
						});
					}
				});
				res.writeHead(302, {
					'Set-Cookie' : cookie,
					'Location' : '/'
				});
				res.end();
			})
		});
	}
	else if(u.query.logout) {
		res.writeHead(302, {
			'Set-Cookie' : 'tok=',
			'Location' : '/'
		});
		name = null;
		res.end();
	}
	else if(u.query.twitter) {
		oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
			if (error) {
				console.log(error);
				res.send('Error')
			}
			else {
				secret[oauth_token] = oauth_token_secret;
				res.writeHead(302, {
					'Location' : 'https://twitter.com/oauth/authenticate?oauth_token='+oauth_token
				})
				res.end();
			}
		});
	}
	else if(u.query.twitterok) {
		var token = u.query.oauth_token;
		var verifier = u.query.oauth_verifier;
		oa.getOAuthAccessToken(token,secret[token],verifier, 
			function(error, oauth_access_token, oauth_access_token_secret, results){
				if (error){
					console.log(error);
					res.send('Error');
				} else {
					console.log(results);
					res.send('OK');
				}
			}
		);
	}
	else {
		var query = u.query;
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
			util.render(res, 'views/index.html', { books: JSON.parse(data), name : name });
		});
	}
}

console.log('Loaded index controller');

