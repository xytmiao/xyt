var Notice = require("../../models/notice.js");

module.exports = function(req, res, father){
	Notice.add(father, req.body, req.files, function(err, result){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.send('success');
	});
}