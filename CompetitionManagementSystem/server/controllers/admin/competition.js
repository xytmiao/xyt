var Competition = require("../../models/competition.js");

module.exports = function(req, res, id){
	Competition.findById(id, function(err, c){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.json(c);
	})
}