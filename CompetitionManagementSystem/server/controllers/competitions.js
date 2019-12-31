var Competition = require("../models/competition.js");
var One = require("../models/one.js");
var sd = require("silly-datetime");

module.exports = function(req, res){
	Competition.find({ hide: false })
		.populate({
			path: "latest",
			model: "One",
		})
		.sort({ no: 1 })
		.exec(function(err, cs){
			if(err){
				res.send("error");
				throw err;
				return;
			}
			res.send(cs.map(c => {
				c = c.toJSON();
				if (c.latest) {
					c.latest.begin = sd.format(c.latest.begin, 'YYYY-MM-DD');
					c.latest.end = sd.format(c.latest.end, 'YYYY-MM-DD');
				}
				delete c.no;
				delete c.hide;
				return c;
			}))
		})
}