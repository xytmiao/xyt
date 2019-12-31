var News = require("../models/news.js");
var sd = require("silly-datetime");

module.exports = function(req, res, id){
	News.findById(id, function(err, n){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		if(!n){
			res.json({title: "该新闻不存在！"});
			return;
		}
		n._doc.date = sd.format(n.date, 'YYYY-MM-DD');
		res.json(n);
	})
}