//处理收到的登陆表单
var Student = require("../models/student.js");
var sendCode = require("../models/email.js").sendCode;

var cache = {}; // 用来记录某个用户的验证码和最后发送时间

exports.first = function(req, res){
	var u = req.body.username;
	if(!u){
		res.send("请输入账号！");
		return;
	}
	Student.findById(u, function(err, result){
		if(!result) res.send("用户不存在！");
		else{
			var m = result.email;
			if(!cache[u]) cache[u] = {};
			if(cache[u].time){
				var current = process.uptime();
				if(current - cache[u].time < 60){
					res.send("请在"+ parseInt(60- current + cache[u].time) + "秒后重试！");
					return;
				}
			}
			var code = (parseInt(Math.random() * 1000000)).toString();
			cache[u].code = code;
			cache[u].time = process.uptime();
			sendCode(m, code, function(err, result){
				if(err){
					throw err;
					res.send("error")
				}else res.send("success");
			})
			
		}
	});
}
exports.second = function(req, res){
	var u = req.body.username;
	var c = req.body.code;
	var p = req.body.newpassword;
	var r = req.body.renewpassword;
	if(!u || !c || !p || !r){
		res.send("请填写完整！");
		return;
	}
	if(cache[u].code != c){
		res.send("验证码错误！");
		return;
	}
	if(p.length < 8 || p.length > 16){
		res.send("密码应为8-16位！");
		return;
	}
	if(p != r){
		res.send("请输入相同的新密码！");
		return;
	}
	Student.gbPassword(u, p, function(err){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		res.send("success");
	})
}
