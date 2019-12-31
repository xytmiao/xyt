var Student = require("../../models/student.js");
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
	// if (data.isGraduate == 1){
	// 	if (! /^\d{2}$/.test(data.class)) {
	// 		res.send("请输入2位数班级！");
	// 		return;
	// 	}
	// } else if (! /^\d{3}$/.test(data.class)) {
	// 	res.send("请输入3位数班级！");
	// 	return;
	// }
	if (data.idcard.length > 18) {
		res.send("请输入正确的身份证号！");
		return;
	}
	if (data.phone.length != 11) {
		res.send("请输入正确的手机号！");
		return;
	}
	// data.class = data.abbr + data.class;
	Student.upInfo(req.session.username, data, function(err){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		req.session.name = data.name;
		res.send("success");
	});
}