var Teacher = require("../../models/teacher.js");
var mine = require("../../models/mine.js");

module.exports = function(req, res){
	var data = req.body;
	if(!data.gender || data.institute == "--请选择学院--" || data.major == "--请选择专业--"){
		res.send("请全部填写！");
		return;
	}
	for(var key in data){
		if(!data[key]){
			res.send("请全部填写！");
			return;
		}
	}
	if(!mine.mailFormat(data.email)){
		res.send("请输入正确的邮箱！");
		return;
	}
	if (data.idcard.length > 18) {
		res.send("请输入正确的身份证号！");
		return;
	}
	if (data.phone.length != 11) {
		res.send("请输入正确的手机号！");
		return;
	}
	Teacher.upInfo(req.session.username, data, function(err){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		req.session.name = data.name;
		res.send("success");
	});
}