var Competition = require("../../models/competition.js")

module.exports = function(req, res, id){
	Competition.editById(id, req.body, function(err){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	})
}