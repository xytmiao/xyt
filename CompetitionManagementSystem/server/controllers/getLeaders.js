var Leader = require("../models/leader.js");

module.exports = function (req, res) {
	Leader.find((err, ls) => {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		res.send(ls);
	})
}