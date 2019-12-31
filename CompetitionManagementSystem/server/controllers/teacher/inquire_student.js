var Student = require("../../models/student.js");
var Record = require("../../models/record.js");
var One = require("../../models/one.js");
var async = require("async");

module.exports = function(req, res, u) {
	Student.findById(u, function(err, s) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		if (!s) {
			res.send("该学生不存在！");
			return;
		}
		s._doc.age = s.getAge();
		s._doc.grade = s.getGrade(new Date());
		s = s.toJSON();
		delete s._id;
		delete s.password;
		Record.find({
			"member.username": u,
			status: 1,
		})
			.populate({
				path: "father",
				populate: { path: "father" },
			})
			.populate("leader")
			.exec(function(err, rs) {
				if (err) {
					res.send("error");
					throw err;
					return;
				}
				rs = rs.map(r => {
					r = r.toJSON();
					r.father.name = r.father.father.name;
					delete r.father.father;
					return r;
				})
				res.send({
					"student": s,
					"record": rs
				})
			
		})
	})
}