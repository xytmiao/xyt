var sd = require('silly-datetime');
var exec = require('child_process').execSync;

module.exports = function(req, res) {
	var t = sd.format(Date.now(), 'YYYYMMDD');
	exec('mongodump -h localhost -d project -o ./mongodump/');
	exec('zip ./dump_zip/dump-' + t + '.zip ./mongodump/project/* -P' + config.db.storePwd);
	res.download("./dump_zip/dump-"+ t + ".zip");
}
