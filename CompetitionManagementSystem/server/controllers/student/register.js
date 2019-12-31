var Student = require("../../models/student.js");
var mine = require("../../models/mine.js");
var exist = require("../../models/exist.js");

module.exports = function(req, res){
	var data = req.body;
	if(!(data.username && data.password && data.repassword && data.email)){
		res.send("请填写完整！");
		return;
	}
	if(data.captcha.toLowerCase() != req.session.captcha){
        res.send("验证码错误！")
        return;
    }
	if(mine.isChinese(data.username)){
		res.send("用户名非法！")
		return;
	}
	if(data.password.length < 8 || data.password.length > 16){
		res.send("密码应是8-16位！");
		return;
	}
	if(data.password != data.repassword){
		res.send("两次密码不相同！")
		return;
	}
	if(!mine.mailFormat(data.email)){
		res.send("邮箱非法！")
		return;
	}
	exist(data.username, function (err, result) {
		if (err) {
			res.send("error");
			throw err;
			return;
		}
		if (result) {
			res.send("该用户已存在");
			return;
		}
		Student.register(data, function(err){
			if(err){
				res.send("error");
				throw err;
				return;
			}
			req.session.username = data.username;
			req.session.identity = "student";
			res.send("success");
		})
	})
	
}
