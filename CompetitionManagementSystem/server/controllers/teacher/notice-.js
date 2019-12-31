var Notice = require("../../models/notice.js");

module.exports = function(req, res, id){
	Notice.deleteById(id, function(err, result){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	});
}