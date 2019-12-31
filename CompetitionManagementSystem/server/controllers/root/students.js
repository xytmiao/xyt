var Coll = require("../../models/student.js");

module.exports = function(req, res){
	Coll.find({}, function(err, rs) {
		if (err) {
			res.send("error");
			throw err;
			return
		}
		res.send(rs);
	})
}