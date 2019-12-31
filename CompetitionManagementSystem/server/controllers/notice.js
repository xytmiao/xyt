var Notice = require("../models/notice.js");
var Competition = require("../models/competition.js");
var sd = require("silly-datetime");

module.exports = function(req, res, id){
	Notice.findById(id, function(err, notice){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		if(!notice){
			res.send({title: "不存在！"});
			return;
		}
		notice._doc.date = sd.format(notice.date, 'YYYY-MM-DD');
		Competition.findById(notice.father, function(err, c) {
			if (err) {
				res.send("error");
				throw err;
				return;
			}
			notice._doc.fathername = c.name;
			res.send(notice);
		})
	})
}