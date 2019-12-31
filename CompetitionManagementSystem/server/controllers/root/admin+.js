var Admin = require("../../models/admin.js");
var exist = require("../../models/exist.js");

module.exports = function(req, res) {
	/*
	req.body = {
		username: "10160",
		password: "123456",
	}
	*/
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
		Admin.register(req.body, function(err) {
			if (err) {
				res.send("error");
				throw err;
				return;
			}
			res.send("success");
		});
	})
}