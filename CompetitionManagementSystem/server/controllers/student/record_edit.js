var Record = require("../../models/record.js");

module.exports = function(req, res, id){
	/*
	data = {
		member[]: [{
			username: String, // 单人由前端获取
			grade: String,	// 输入
		}],
		item: String, //项目名，可空
		category: String, // 参赛方向，可空
		leader: String, //单人不需要输入
		phone: String, // 单人不需要输入
		institute: String, // 单人不需要输入
	}
	*/
	var data = req.body;
	Record.findById(id, function(err, r) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		var d = new Date();
		if (r.father.end < d) {
			res.send("已超过截止日期！不能更改！");
		} else if (r.member[0].username != req.session.username) {
			res.send("抱歉，只允许队长修改");
		} else {
			data.member.forEach((usr, i) => data.member[i] = {"username": usr});
			data.status = 0;
		}
		Record.edit(id, data, function(err, record){
			if(err){
				res.send("error");
				throw err;
				return;
			}
			res.json("success");
		})
	})
}