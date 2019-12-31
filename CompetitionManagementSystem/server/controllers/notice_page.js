var Notice = require("../models/notice.js");

module.exports = function(req, res, father){
	Notice.countDocuments({"father": father}, function(err, cnt) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		res.send({"page": parseInt((cnt - 1) / 10 + 1)});
	}) 
}