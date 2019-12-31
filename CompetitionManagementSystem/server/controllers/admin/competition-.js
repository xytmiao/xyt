var Competition = require("../../models/competition.js");

module.exports = function(req, res, id){
	Competition.deleteById(id, function(err, result){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	});
}