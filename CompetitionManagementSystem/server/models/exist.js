var Teacher = require("./teacher.js");
var Student = require("./student.js");
var Admin = require("./admin.js");
var Root = require("./root.js");

function exist(u, callback) {
	Student.findById(u, function(err, s) {
		if (err) {
			callback(err, null);
			return;
		}
		if (s) {
			callback(null, true);
			return;
		}
		Teacher.findById(u, function(err, t) {
			if (err) {
				callback(err, null);
				return;
			}
			if (t) {
				callback(null, true);
				return;
			}
			Admin.findById(u, function(err, a) {
				if (err) {
					callback(err, null);
					return;
				}
				if (a) {
					callback(null, true);
					return;
				}
				Root.findById(u, function(err, r) {
					if (err) {
						callback(err, null);
						return;
					}
					if (r) {
						callback(null, true);
						return;
					}
					callback(null, false);
				})
			})
		})
	});
}




module.exports = exist;