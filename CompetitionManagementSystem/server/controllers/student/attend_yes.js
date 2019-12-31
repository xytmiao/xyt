var Record = require("../../models/record.js");
var One = require("../../models/one.js");

module.exports = function(req, res, id){
	/*
	data = {
		"member": [String],
	    "recruit": {
			"status": Boolean, // true招募中，false停止招募
		}, // 招募信息
		"item": String, //项目名
		"category": String, // 参赛方向
		"introduction": String, // 该项目简介
		"leader": {
			"username": {type: String, default: "未分配"}, //工号
			"phone": String,
			"institute": String,
		},
	}
	*/
	var data = req.body;
	One.findById(id, function(err, o) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		if (o.end < new Date()) {
			res.send("已超过截止日期！不能报名！");
			return;
		}

		// 报名
		data.member.forEach((usr, i) => data.member[i] = {"username": usr});
		Record.add(id, data, function(err, result){
			if(err){
				res.send("error");
				throw err;
				return;
			}
			res.send("success");
		});
	})
	
}
