var One = require("../../models/one.js");
var Competition = require("../../models/competition.js")
var sd = require("silly-datetime");

module.exports = function(req, res, id){
	Competition.findById(id, function(err, c){
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		if (!c) {
			res.send("该竞赛不存在！");
			return;
		}
		One.findByFather(id, function(err, os){
			if(err){
				res.send("error");
				throw err;
				return;
			}
			var data = os.map(o => ({
				id: o._id,
				version: o.version,
				date: sd.format(o.date, 'YYYY-MM-DD'),
			}))
			res.json({
				name: c.name,
				data: data,
			});

		})
	})
	
}