var Coll = require("../../models/competition.js");

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