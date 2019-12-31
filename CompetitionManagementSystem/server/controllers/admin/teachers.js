var Teacher = require("../../models/teacher.js");

module.exports = function(req, res) {
	Teacher.find().sort({"username": 1}).exec(function (err, ts) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		res.send(ts.map(t => t.username));
	})
}