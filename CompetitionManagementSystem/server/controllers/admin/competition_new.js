var Competition = require("../../models/competition.js");
var Teacher = require("../../models/teacher.js");

module.exports = function(req, res){
	Teacher.findById(req.body.teacher, function(err, result){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		if(!result){
			res.send(req.body.teacher + "未注册！请先分配！");
			return;
		}
		Competition.add(req.body, function(err){
			if(err){
				res.send("error");
				throw err;
				return;
			}
			res.send("success");
		});
	})
	
}