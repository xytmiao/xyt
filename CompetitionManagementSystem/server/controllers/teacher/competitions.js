var Competition = require("../../models/competition.js");
var sd = require("silly-datetime");

module.exports = function(req, res){
	Competition.findByTeacher(req.session.username, function (err, cs) {
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.send(cs.map(c => ({
			id: c._id,
			name: c.name,
			date: sd.format(c.date, 'YYYY-MM-DD'),
		})))
	})
}