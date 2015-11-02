var cfg = require('./appcfg');
var domain = require('domain');
var md = domain.create();
var endpoints = [
	'//',
	'/api/sessions', 
	'/api/users',
	'/api/books',
	'/admin',
	'/books',
	'/user',
	'/buy'
];
var index = require('./controller/index');
var handler = require('./handler');
var app = handler();
var ctl = {};
var util = require('./myutil');
app.urls(endpoints);
for(var m in endpoints) {
	if(endpoints[m] === '//') {
		ctl[endpoints[m]] = require('./controller/index');
	}
	else {
		ctl[endpoints[m]] = require('./controller' + endpoints[m]);
	}
}
for(var m in endpoints) {
	app.get(endpoints[m], ctl[endpoints[m]].handler)
}

md.run(function() {
	app.listen(cfg.port);
});
md.on('error', function(err) {
	console.log(err);
});


console.log('Loaded application context');