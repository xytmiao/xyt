var Record = require("../../models/record.js");

module.exports = function(req, res, id){
	Record.findById(id, function(err, r) {
		if(err){
			res.send("error");
			throw err;
			return;
		}
		if (r.deadline < new Date()) {
			res.send("已超过截止日期！不能更改！");
		} else if (r.member[0].username != req.session.username) {
			res.send("抱歉，只允许队长修改");
		} else {
			Record.deleteById(id, function(err){
				if(err){
					res.send("error");
					throw err;
					return;
				}
				res.send("success");
			})
		}
	})
	
}