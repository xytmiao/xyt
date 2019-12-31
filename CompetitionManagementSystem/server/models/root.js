var mongoose = require("mongoose");
var encode = require("./encode.js");

// 超级管理员
var rootSchema = new mongoose.Schema({
    "username": String,
	"password": String,
}, { versionKey: false });

rootSchema.statics.findById = function(u, callback) {
    Root.findOne({"username": u}, callback);
}

// 超级管理员登录方法
rootSchema.statics.login = function(obj, callback){
	Root.findOne({"username": obj.username}, function(err, result){
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

var Root = mongoose.model("Root", rootSchema);

// 创建默认超级管理员
var obj = config.defaultRoot;
if (obj) {
    Root.findById(obj.username, function(err, r) {
        if (err) {
            throw err;
            return;
        }
        if (!r) {
            obj.password = encode(obj.password);
            Root.create(obj, function(err) {
                if (err) {
                    throw err;
                }
            });
        }
    })
}

module.exports = Root;

