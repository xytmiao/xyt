var Record = require("../../models/record.js");
var Competition = require("../../models/competition.js");
var mongoose = require("mongoose");

module.exports = function(req, res, id){
	Competition.findById(id, function(err, competition){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		Record.findOne({
			"father": new mongoose.Types.ObjectId(competition.latest), 
			"member.username": req.session.username,
		}, 
			function(err, result){
			if(err){
				res.send("error");
				throw err;
				return;
			}
			if(!result) res.send("0"); // 未报名
			else res.send(result._id); // 已报名
		})
	})
}
    