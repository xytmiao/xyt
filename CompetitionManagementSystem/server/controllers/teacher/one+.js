var One = require("../../models/one.js");

module.exports = function(req, res, id){
	var data = req.body;
	for(var key in data){
		if(!req.body[key]){
			res.send("请全部填写！");
			return;
		}
	}
	One.add(id, req.body, function(err){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	});
	
}