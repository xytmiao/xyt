var Leader = require("../../models/leader.js");
var EventEmitter = require('events').EventEmitter;

module.exports = function (req, res) {
	var ls = JSON.parse(req.body.data);
	var ee = new EventEmitter();
	ee.once('done', () => res.send("success"))
	var cnt = 0;
	ls.forEach((l, i) => {
		Leader.add(l, err => {
			if (err) {
				res.send("error");
				throw err;
				return;
			}
			if (++cnt == ls.length) ee.emit("done");
		});
	})
}