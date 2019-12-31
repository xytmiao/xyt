var One = require("../../models/one.js");

module.exports = function(req, res, oid){
	One.findById(oid, function(err, o){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.json(o);
	})
}