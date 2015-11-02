var mongoose = require('mongoose');
var util = require('../myutil');
var cfg = require('../appcfg');
mongoose.connect('mongodb://' + cfg.baseUrl + '/bookworm');
var con = mongoose.connection;
con.on('error', function() {
	// util.sendError(500, 'Server error. (Database)',)
	console.log('db error');
});
module.exports = {
	con : con
}
