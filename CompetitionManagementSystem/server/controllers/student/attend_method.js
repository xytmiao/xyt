var One = require("../../models/one.js");
var path = require("path");

module.exports = function(req, res, id){
	One.findOne({_id: id})
		.populate("father")
		.exec(function (err, o) {
			if(err){
				res.send("error");
				throw err;
				return;
			}
			res.sendFile(path.resolve("./public/student/"+ o.father.attend + ".html"));
	})
}