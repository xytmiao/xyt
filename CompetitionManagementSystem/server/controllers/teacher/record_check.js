var Record = require("../../models/record.js")
var Student = require("../../models/student.js")
var async = require("async");

module.exports = function(req, res, id){
	var data = req.body;
	data.recruit = false;
	if (data.status == 1) {
		Record.findById(id, function(err, r) {
			if(err){
				res.send("error");
				throw err;
				return;
			}
			for (k in data) {
				r[k] = data[k];
			}
			var tasks = [];
			r.member.forEach(function(ts, i) {
				tasks.push(function(callback) {
					Student.findById(ts.username, function(err, s) {
						if (err) callback(err);
						else {
							s._doc.age = s.getAge();
							s._doc.grade = s.getGrade(r.date);
							s = s.toJSON();
							r.member[i] = s;
							callback(null);
						}
					})
				})
			})
			tasks.push(function(callback) {
				r.save(function(err) {
					if (err) callback(err);
					else callback(null);
				})
			})
			async.waterfall(tasks, function(err) {
				if (err) {
					res.send("error");
					throw err;
					return;
				}
				res.send("success");
			})
		})
	} else {
		Record.edit(id, data, function(err) {
			if (err) {
				res.send("error");
				throw err;
				return;
			}
			res.send("success");
		})
	}
	
	
}