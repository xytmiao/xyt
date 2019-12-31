var Teacher = require("../../models/teacher.js");
var exist = require("../../models/exist.js");

module.exports = function(req, res) {
	exist(req.body.username, function(err, result) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		if (result) {
			res.send("该用户已存在！");
			return;
		}
		Teacher.register(req.body, function(err) {
			if (err) {
				res.send("error");
				throw err;
				return;
			}
			res.send("success");
		})
	})
}