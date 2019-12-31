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
		qc = {
			teacher: req.session.username,
			hide: false,
		},
		qo = { 
			[["prizeDate", "begin"][data.method]]: { $gte: s, $lte: e },
		};
	data.competition == '全部竞赛' || (qc._id = data.competition);
	Competition.find(qc, function (err, cs) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		var cname = {}; // 竞赛id映射到竞赛名
		qo.father = cs.map(c => {
			cname[c._id] = c.name;
			return c._id;
		});
		One.find(qo, function(err, os) {
			if (err) {
				res.send("error");
				throw err;
				return;
			}
			var omap = {}; // One的id映射到o
			var oids = os.map(o => {
				omap[o._id] = o.toJSON();
				return o._id
			});
			Record.find({ 
				"father": oids, 
				status: 1, 
			})
				.populate("leader")
				.exec((err, rs) => {
					if (err) {
						res.send("error");
						throw err;
						return;
					}
					res.send(rs.map(r => {
						r = r.toJSON();
						r.father = omap[r.father];
						r.father.name = cname[r.father.father];
						return r;
					}))
				})
		})
	})
	
}
