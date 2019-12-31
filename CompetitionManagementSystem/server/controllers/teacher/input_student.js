var Student = require("../../models/student.js");
var encode = require("../../models/encode.js");
var qs = require("qs");
var EventEmitter = require('events').EventEmitter;

module.exports = function (req, res) {
	var ss = JSON.parse(req.body.data);
	var ee = new EventEmitter();
	ee.once("done", () => res.send("success"));

	var cnt = 0;
	ss.forEach(ns => {
		if (ns.idcard.length == 18) {
			var y = ns.idcard.substr(6, 4),
				m = ns.idcard.substr(10, 2),
				d = ns.idcard.substr(12, 2);
			ns.born = new Date(y + '/' + m + '/' + d);
		}
		Student.findOne({username: ns.username}, (err, s) => {
			if (s) {
				for (var attr in ns) s[attr] = ns[attr];
				s.save(err => {
					if (err) {
						res.send("error");
						throw err;
						return;
					}
					if (++cnt == ss.length) ee.emit("done");
				})
			} else {
				ns.password = encode("12345678");
				Student.create(ns, err => {
					if (err) {
						res.send("error");
						throw err;
						return;
					}
					if (++cnt == ss.length) ee.emit("done");
				});
			}
		})
	})
	
}