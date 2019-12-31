var mongoose = require("mongoose");
var encode = require("./encode.js");

// 负责人
var teacherSchema = new mongoose.Schema({
    "username": String,
    "password": { type: String, default: config.teacher.password },
    "name": String,
    "gender": Number, // 0-男 1-女
    "idcard": String,
    "phone": String,
    "email": String,
    "institute": String,
    "major": String,
}, { versionKey: false });

// 负责人登录方法
teacherSchema.statics.login = function(obj, callback) {
    Teacher.findOne({ "username": obj.username }, function(err, result) {
        if (err) {
            callback(err, null);
            return;
        }
        if (!result) {
            callback(null, '用户不存在！');
            return;
        }
        if (encode(obj.password) != result.password) {
            callback(null, "密码错误！");
            return;
        }
        callback(null, "success");
    });
}

// 负责人注册方法
teacherSchema.statics.register = function(obj, callback) {
    obj.password = encode(obj.password);
    Teacher.create(obj, callback);
}

// 负责人修改信息
teacherSchema.statics.upInfo = function(username, data, callback){
    Teacher.updateOne({"username": username}, data, callback); //回调函数必须要有，不然修改失败
}

// 负责人修改密码
teacherSchema.statics.password_change = function(u, obj, callback) {
    obj.password = encode(obj.password);
    Teacher.updateOne({ "username": u }, obj, callback);
}

// 重置负责人密码
teacherSchema.statics.reset = function(u, callback) {
    Teacher.updateOne({ "username": u }, { "password": encode(config.teacher.password) }, callback);
}

teacherSchema.statics.findById = function(id, callback) {
    Teacher.findOne({ "username": id }, callback);
}

var Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;