var exec = require('child_process').execSync;
var fs = require('fs');

module.exports = function(req, res) {
	var file = req.file;
	exec('unzip -oP '+ config.db.storePwd + ' ' + file.path);
	exec('mongorestore -h localhost -d project --dir ./mongodump/project/ --drop');
	fs.unlinkSync(file.path);
	res.send("success");
}
