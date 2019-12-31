var One = require("../../models/one.js");

module.exports = function(req, res, id){
	One.findOne({"_id": id})
		.populate("father")
		.exec(function(err, o){
			if(err){
				res.send("error");
				throw err;
				return;
			}
			res.send(o);
	})
}