var Field = require("../../models/field.js");

module.exports = function(req, res) {
	Field.findByFather(req.session.username, function(err, fs) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		res.send(fs.map(fs => fs.field));
	})
}