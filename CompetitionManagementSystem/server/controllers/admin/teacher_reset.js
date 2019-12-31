var Teacher = require("../../models/teacher.js");

module.exports = function(req, res, u) {
	Teacher.reset(u, function(err) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	})
}