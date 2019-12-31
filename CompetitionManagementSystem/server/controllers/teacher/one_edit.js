var One = require("../../models/one.js");

module.exports = function(req, res, id){
	for(var key in req.body){
		if(!req.body[key]){
			res.send("请全部填写！");
			return;
		}
	}
	One.editById(id, req.body, function(err, result){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	})
}