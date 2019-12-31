var News = require("../models/news.js");
var sd = require("silly-datetime");

module.exports = function(req, res, p){
	News.find()
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
				id: n._id,
				title: n.title,
				date: sd.format(n.date, 'YYYY-MM-DD')
			})))
		})
}