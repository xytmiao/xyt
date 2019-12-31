var News = require("../../models/news.js");
var mongoose = require("mongoose");

module.exports = function(req, res, id) {
	News.editById(id, req.body, req.files, function(err, result) {
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	});
}