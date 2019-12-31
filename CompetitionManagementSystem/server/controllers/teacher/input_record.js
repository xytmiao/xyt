var Record = require("../../models/record.js");
var Competition = require("../../models/competition.js");
var Student = require("../../models/student.js");
var Leader = require("../../models/leader.js");
var EventEmitter = require('events').EventEmitter;

module.exports = function (req, res) {
	var rs = JSON.parse(req.body.data);
	var ee = new EventEmitter();
	var oid;
	var lid = {}; // 指导教师工号映射到指导教师id

	ee.once('done', () => res.send("success"))
	ee.once('c&l', () => {
		var cnt = 0;
		rs.forEach((r, i) => {
			r.father = oid;
			r.status = 1;
			ee.once('r' + i, () => {
				Record.create(r, err => {
					if (err) {
						res.send("error");
						throw err;
						return;
					}
					if (++cnt == rs.length) ee.emit("done");
				});
			})
			var cnt1 = 0;
			r.leader = [lid[r.leader.name]];
			r.member.forEach((m, i1) => {
				Student.findById(m.username, (err, s) => {
					if (err) {
						res.send("error");
						throw err;
						return;
					}
					if (!s) {
						res.send(r.member[i1].username + "不存在！请先导入或注册！");
						return;
					}
					s._doc.age = s.getAge();
					s._doc.grade = s.getGrade(new Date());
					r.member[i1] = s.toJSON();
					if (++cnt1 == r.member.length) ee.emit('r' + i);
				})
			})
		})
	})

	var cnt0 = 0;
	Competition.findOne({"name": rs[0].name}, (err, c) => {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		if (!c) {
			res.send("该竞赛不存在！");
			return;
		}
		oid = c.latest;
		if (++cnt0 == 2) ee.emit('c&l');
	})
	Leader.find((err, ls) => {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		ls.forEach(l => lid[l.name] = l._id);
		if (++cnt0 == 2) ee.emit('c&l');
	})
}