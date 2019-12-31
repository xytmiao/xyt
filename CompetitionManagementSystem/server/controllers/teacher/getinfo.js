var Teacher = require("../../models/teacher.js");

module.exports = function(req, res){
	Teacher.findById(req.session.username, function(err, s) {
		if(err){
			res.send("error");
			throw err;
			return
		}
		s.username = undefined;
		s.password = undefined;
		res.json(s);
	});
}