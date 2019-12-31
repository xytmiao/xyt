var Student = require("../../models/student.js");

module.exports = function(req, res){
	Student.findById(req.session.username, function(err, s) {
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