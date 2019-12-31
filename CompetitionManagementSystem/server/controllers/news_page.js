var News = require("../models/news.js");

module.exports = function(req, res, father){
	News.countDocuments({}, function(err, cnt) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		res.send({"page": parseInt((cnt - 1) / 10 + 1)});
	}) 
}