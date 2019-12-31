var Notice = require("../../models/notice.js");

module.exports = function(req, res, id) {
	Notice.editById(id, req.body, req.files, function(err) {
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	});
}