var Leader = require("../../models/leader.js");

module.exports = function (req, res) {
	var l = req.body;
	Leader.add(l, (err, nl) => {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		res.send(nl._id);
	})
	return;
}