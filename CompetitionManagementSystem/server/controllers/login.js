//处理收到的登陆表单
var Student = require("../models/student.js");
var Teacher = require("../models/teacher.js");
var Admin = require("../models/admin.js");
var Root = require("../models/root.js");

module.exports = function(req, res){
    if(!(req.body.username && req.body.password)){
        res.send("请填写完整！");
        return;
    }
    if(req.body.captcha.toLowerCase() != req.session.captcha){
        res.send("验证码错误！")
        return;
    }
	Student.login(req.body, function(err, result){
        if(err){
            res.send("error");
            throw err;
            return;
        }
        if(result == "success"){
            Student.findById(req.body.username, function(err, s) {
                if (err) {
                    res.send("error");
                    throw err;
                    return;
                }
                req.session.name = s.name;
                req.session.username = req.body.username;
                req.session.identity = "student";
                res.send(result);
            })
            return;
        }
        else if(result == "密码错误！"){
            res.send(result);
            return;
        }
        else Teacher.login(req.body, function(err, result){
            if(err){
                res.send("error");
                throw err;
                return;
            }
            if(result == "success"){
                req.session.username = req.body.username;
                req.session.identity = "teacher";
                res.send(result);
                return;
            }
            if(result == "密码错误！"){
                res.send(result);
                return;
            }
            Admin.login(req.body, function(err, result){
                if(err){
                    res.send("error");
                    throw err;
                    return;
                }
                if(result == "success"){
                    req.session.username = req.body.username;
                    req.session.identity = "admin";
                    res.send(result);
                    return;
                }
                if(result == "密码错误！"){
                    res.send(result);
                    return;
                }
                Root.login(req.body, function(err, result){
                    if(err){
                        res.send("error");
                        throw err;
                        return;
                    }
                    if(result == "success"){
                        req.session.username = req.body.username;
                        req.session.identity = "root";
                        res.send(result);
                        return;
                    }
                    res.send(result);
                })
            })
        })
    })
}
