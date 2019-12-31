var exec = require('child_process').execSync;
var fs = require('fs');

module.exports = function(req, res, path) {
	exec('unzip -oP ' + config.db.storePwd + ' dump_zip/' + path);
	exec('mongorestore -h localhost -d project --dir ./mongodump/project/ --drop');
	res.send("success");
}
