var fs = require("fs");
var path = require("path");

module.exports = function(req, res) {
	fs.readdir(path.resolve("./log"), function(err, files) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		res.send(files);
	})
}