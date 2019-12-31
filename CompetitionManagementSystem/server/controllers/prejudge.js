var Student = require("../models/student.js");

module.exports = function(req, res, next){
	if(!req.session.username){
		// 未登录跳转到登录界面
		res.redirect("/login"); 
		return;
	}
	if(req.session.identity != "student" || req.url == "/student/upinfo/change" || req.url == "/student/upinfo/change?info=1"){
		next();
		return;
	}
	Student.findById(req.session.username, function(err, obj){
		if(err){
			res.send("error");
			throw err;
			return;
		}
		if(obj.born){
			req.session.isComplete = true;
			next();
		}else res.redirect("/student/upinfo/change");
	});
}