var Record = require("../../models/record.js");
var Student = require("../../models/student.js");

module.exports = function(req, res, id){
	/*
	data = {
		"father": mongoose.Schema.ObjectId,
		"name": String,
		"version": String,
	    "member": [{
	    	"username": String,
			"name": String,
			"age": Number, // 由学生的出生born计算
			"gender": String,
			"idcard": String,
			"phone": String,
			"mail": String,
			"institute": String,
			"major": String,
			"class": String,
			"grade": String, // 学生输入
	    }],
		"item": String, //项目名
		"category": String, // 参赛方向
		"leader": {type: String, default: "未分配"}, //工号
		"phone": String,
		"institute": String,
		"status": {type: String, default: "未审核"}, // 记录状态: 未审核，未通过，已通过，招募中，人满
		"date": {type: Date, default: ()=> new Date()},
		"remark": String, // 审核后负责人留下的备注
		"deadline": Date,
	}
	*/
	Record.findOne({"_id": id})
		.populate("leader")
		.exec(function (err, r) {
			if(err){
				res.send("error");
				throw err;
				return;
			}
			if (r.status == 1) {
				res.send(r);
				return;
			}
			(function it(i){
				if(i == r.member.length){
					res.send(r);
					return;
				}
				Student.findById(r.member[i].username, function(err, s){
					if(err){
						res.send("error");
						throw err;
						return;
					}
					s._doc.age = s.getAge();
					s._doc.grade = s.getGrade(r.date);
					s = s.toJSON();
					r.member[i] = s;
					it(i + 1);
				});
			})(0)
		})
}