var mongoose = require("mongoose");
var encode = require("./encode.js");

//管理员
var adminSchema = new mongoose.Schema({
    "username": String,
	"password": String,
}, { versionKey: false });

adminSchema.statics.findById = function(u, callback) {
    Admin.findOne({"username": u}, callback);
}

// 管理员登录方法
adminSchema.statics.login = function(obj, callback){
	Admin.findOne({"username": obj.username}, function(err, result){
        if(err){
            callback(err, null);
            return;
        }
    	if(!result){
    		callback(null, '用户不存在！');
    		return;
    	}
    	if(encode(obj.password) != result.password){
    		callback(null, "密码错误！");
    		return;
    	}
    	callback(null, "success");
    });
}

// 管理员注册
adminSchema.statics.register = function(obj, callback) {
    obj.password = encode(obj.password);
    Admin.create(obj, callback);
}

// 管理员修改密码
adminSchema.statics.upInfo = function(u, obj, callback) {
   obj.password = encode(obj.password);
    Admin.updateOne({"username": u}, obj, callback);
}

var Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
