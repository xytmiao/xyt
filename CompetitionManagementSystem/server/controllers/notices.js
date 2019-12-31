var Notice = require("../models/notice.js");
var sd = require("silly-datetime");

module.exports = function(req, res, father, p){
	Notice.find({"father": father})
		.sort({"date": -1})
		.skip((p - 1) * 10)
		.limit(10)
		.exec(function(err, ns){
			if(err){
				res.send("error");
				throw err;
				return;
			}
			res.send(ns.map(n => ({
				"title": n.title,
				"date": sd.format(n.date, 'YYYY-MM-DD'),
				"id": n._id
			})))
		})
}