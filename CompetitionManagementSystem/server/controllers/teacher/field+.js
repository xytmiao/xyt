var Field = require("../../models/field.js");

module.exports = function(req, res) {
	Field.add(req.session.username, req.body.field, function(err) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	})
}