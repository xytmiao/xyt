var Record = require("../../models/record.js");
var Competition = require("../../models/competition.js");
var async = require("async");
var sd = require("silly-datetime");

module.exports = function(req, res){
	Record.findByStudent(req.session.username, function(err, rs){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		var tasks = [];
		var data = [];
		rs.forEach(r => {
			tasks.push(function (callback) {
				var one = r.father.toJSON();
				var d = {
					id: r._id,
					canEdit: (one.end > new Date()) && (r.member[0].username == req.session.username),
					father: (one.end = sd.format(one.end, 'YYYY-MM-DD')) && (one.start = sd.format(one.start, 'YYYY-MM-DD')) && one,
					status: r.status,
					prize: r.prize,
				};
				Competition.findById(one.father, function (err, c) {
					if (err) callback(err);
					else {
						d.father.name = c.name;
						data.push(d);
						callback(null);
					}
				})
			})
		})
		async.waterfall(tasks, err => {
			if (err) {
				res.send("error");
				throw err;
				return;
			}
			res.send(data);
		})
	})
}