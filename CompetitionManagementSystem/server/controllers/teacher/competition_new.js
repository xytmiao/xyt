var Competition = require("../../models/competition.js");

module.exports = function(req, res, id){
	Competition.findById(id, function(err, result){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.json({
	    	name: result.name,
	    	attend: result.attend,
	    	teacher: result.teacher
	    })
	})
}