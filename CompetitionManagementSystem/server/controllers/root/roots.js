var Coll = require("../../models/root.js");

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