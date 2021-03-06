var Competition = require("../../models/competition.js");

module.exports = function(req, res){
	Competition.find({
		"latest": { $ne: undefined },
		"hide": false
	})
		.sort({"no": 1})
		.exec(function(err, cs) {
			if (err) {
				res.send("error");
				throw err;
				return;
			}
			res.send(cs.map(c => ({
				"name": c.name,
				"id": c.id
			})));
	})
}