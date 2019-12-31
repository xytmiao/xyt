var Competition = require("../../models/competition.js");

module.exports = function(req, res){
	Competition.find({
		"teacher": req.session.username,
		"latest": {$ne: undefined}
	}, function(err, result){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		var data = [];
		for(var i in result){
			data.push({
				"id": result[i].latest,
				"name": result[i].name
			})
		}
		res.json(data);
	})
}