var Record = require("../../models/record.js");

module.exports = function(req, res){
	Record.find()
		.populate("father")
		.exec(function(err, rs) {
			if (err) {
				res.send("error");
				throw err;
				return
			}
			res.send(rs);
		})
}