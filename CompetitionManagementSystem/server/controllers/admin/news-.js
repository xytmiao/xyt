var News = require("../../models/news.js");

module.exports = function(req, res, id){
	News.deleteById(id, function(err, result){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	});
}