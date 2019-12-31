var Record = require("../../models/record.js");
var One = require("../../models/one.js");
var Competition = require("../../models/competition.js");
var async = require("async");

module.exports = function(req, res) {
	// data.method == 0 获奖时间
	// data.method == 1 竞赛开始报名时间
	var data = req.query,
		s = new Date(data.start),
		e = new Date(data.end),
		qo = { [["prizeDate", "begin"][data.method]]: { $gte: s, $lte: e } };
	data.competition == '全部竞赛' || (qo.father = data.competition);
	One.find(qo) // 找到符合条件的所有one
		.exec(function(err, os) {
			if (err) {
				res.send("error");
				throw err;
				return;
			}
			var oids = os.map(o => o._id);
			Record.find({ "father": oids, status: 1 })
				.populate("father")
				.populate("leader")
				.exec(function(err, rs) {
					if (err) {
						res.send("error");
						throw err;
						return;
					}
					var data = [];
					var tasks = rs.map(r => 
						function (callback) {
							Competition.findById(r.father.father, function (err, c) {
								if (err) callback(err);
								else {
									r.father = r.father.toJSON();
									r.father._doc.name = c.name;
									data.push(r);
									callback(null);
								}
							})
						}
					)
					async.waterfall(tasks, err => {
						if (err) {
							res.send("error");
							throw err;
							return;
						}
						res.send(data);
					})
				})
		})
}
