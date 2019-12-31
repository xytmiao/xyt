var One = require("../models/one.js");
var Competition = require("../models/competition.js");
var sd = require("silly-datetime");

module.exports = function(req, res, id){
	Competition.findById(id, function(err, c){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		if(!c){
			res.send("该竞赛不存在！");
			return;
		}
		if(!c.latest){
			res.send("该竞赛还不能报名！");
			return;
		}
		One.findById(c.latest, function(err, o){
			if(err){
				res.send("error");
				throw err;
				return;
			}
			o = o.toJSON();
			o.canEdit = new Date() < o.end;
			o.begin = sd.format(o.begin, "YYYY-MM-DD");
			o.end = sd.format(o.end, "YYYY-MM-DD");
			['name', 'teacher', 'attend', 'isGraduate', 'level', 'class' ,'sponsor'].forEach(attr => o[attr] = c[attr]);
			delete o.father;
			res.json(o);
		})
	})
}